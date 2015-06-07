angular.module('hack', [
    'ionic',
    'cordovaNetworkInformationModule',
    'pascalprecht.translate',
    'hack.controllers',
    'hack.directives',
    'hack.factories',
    'hack.environment'
])

    .run([
        '$rootScope',
        '$ionicPlatform',
        'AuthSvc',
        'cordovaNetworkInformationService',
        'cordovaNetworkInformationConstants',
        '$translate',
        'ContactSvc',
        '$ionicPopup',
        '$ionicHistory',
        'DeviceSvc',
        function($rootScope,$ionicPlatform,AuthSvc,cordovaNetworkInformationService,cordovaNetworkInformationConstants,$translate,ContactSvc,$ionicPopup,$ionicHistory,DeviceSvc) {

            $rootScope.contacts = {};
            $rootScope.contacts.pending = 0;

            $ionicPlatform.ready(function() {

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                var language = localStorage.getItem('language');

                if (typeof navigator.globalization !== 'undefined' && !language) {
                    navigator.globalization.getPreferredLanguage(function(language) {
                        $rootScope.language = (language.value).split('-')[0];
                        $translate.use((language.value).split('-')[0]).then(function(data) {
                            console.log('Using language resource ' + language.value);
                        }, function(error) {
                            console.log('Error setting language ' + language.value + ': ' + error);
                        });
                    }, null);
                }else if(language){
                    $rootScope.language = language;
                    $translate.use(language).then(function(data) {
                        console.log('Using language resource ' + language);
                    }, function(error) {
                        console.log('Error setting language ' + language + ': ' + error);
                    });
                }else{
                    $rootScope.language = 'es';
                    $translate.use('es').then(function(data) {
                        console.log('Using language resource ' + language);
                    }, function(error) {
                        console.log('Error setting language ' + language + ': ' + error);
                    });
                }

                onOnline();

                cordovaNetworkInformationService.addConnectionStatusChangedListener(cordovaNetworkInformationConstants.connectionStatusEvent.offline, onOffline);

                /**
                 * This will happen when the user is online
                 * @method onOnline
                 */
                function onOnline() {
                    AuthSvc.autoAccess(function(response){
                        if(response.code !== 200){
                            $rootScope.$broadcast('access',false);
                        }else{
                            $rootScope.$broadcast('access',true);
                            AuthSvc.user = response.result;
                            DeviceSvc.user = response.result;
                            getContacts();
                        }
                    });
                }

                /**
                 * If the user is offline, will appear this message
                 * @method onOffline
                 */
                function onOffline() {
                    alert('Algo a pasado con tu conexion, por favor revisa tus datos he intentalo de nuevo.');
                }


                /**
                 * @method getContacts
                 */
                function getContacts(){
                    ContactSvc.get(function(response) {
                        $rootScope.contacts.pending = 0;
                        angular.forEach(response.result, function (item) {
                            if(!item || !item.deviceTo || !item.deviceFrom || !AuthSvc.user || !AuthSvc.user._id)return;
                            if ((item.deviceTo._id === AuthSvc.user._id) && (item.deviceFrom._id !== AuthSvc.user._id)) {
                                if (!item.deviceFrom.isContact) {
                                    $rootScope.contacts.pending += 1;
                                }
                            }
                        });
                    });
                }

                $ionicPlatform.registerBackButtonAction(function () {
                    $ionicPopup.confirm({
                        title: 'Exit!!!',
                        template: 'Estas seguro que deseas salir de la aplicación?'
                    }).then(function(res){
                        if( res ){
                            navigator.app.exitApp();
                        }else{
                            $ionicHistory.goBack();
                        }
                    });
                }, 100);
            });
        }])

    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        $translateProvider.preferredLanguage('es');
        $translateProvider.fallbackLanguage('es');
        $translateProvider.useStaticFilesLoader({
            prefix: './language/',
            suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy('escaped');

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'MenuCtrl'
            })

            .state('app.skills', {
                url: "/skills",
                views: {
                    'menuContent': {
                        templateUrl: "templates/skills.html",
                        controller: 'SkillsCtrl'
                    }
                }
            })

            .state('app.matches', {
                cache: false,
                url: "/search/:query",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matches.html",
                        controller: 'SearchCtrl'
                    }
                }
            })

            .state('app.user', {
                cache: false,
                url: "/user/:deviceId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/user.html",
                        controller: 'UserCtrl'
                    }
                }
            })

            .state('app.userAsk', {
                cache: false,
                url: "/user/:deviceId/:ask",
                views: {
                    'menuContent': {
                        templateUrl: "templates/user.html",
                        controller: 'UserCtrl'
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('app.contacts', {
                cache: false,
                url: "/contacts",
                views: {
                    'menuContent': {
                        templateUrl: "templates/contacts.html",
                        controller: 'ContactsCtrl'
                    }
                }
            })

            .state('app.calendar', {
                url: "/calendar",
                views: {
                    'menuContent': {
                        templateUrl: "templates/calendar.html",
                        controller: 'CalendarCtrl'
                    }
                }
            })

            .state('app.sponsors', {
                url: "/sponsors",
                views: {
                    'menuContent': {
                        templateUrl: "templates/sponsors.html",
                        controller: 'SponsorCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/calendar');
    });

var controllers = angular.module('hack.controllers', []);
var factories = angular.module('hack.factories', []);
var environment = angular.module('hack.environment', []);
var directives = angular.module('hack.directives', []);