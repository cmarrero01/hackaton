var registerId = null;

factories.factory('PushSvc',[
    function(){

        function register(){

            var successHandler = function(result){
                console.log('DEVICE REGISTERED');
            };

            var errorHandler = function(err){
                console.log('ERROR REGISTER DEVICE',err);
            };

            if(!window.plugins){
                console.log('Push Error. Plugins undefined');
                return;
            }

            window.plugins.pushNotification.register(
                successHandler,
                errorHandler,
                {
                    "senderID":"ID_APP",
                    "ecb":"onNotification"
                });
        }

        function unregister(){

            var successHandler = function(result){
                console.log('DEVICE REGISTERED');
            };

            var errorHandler = function(err){
                console.log('ERROR REGISTER DEVICE');
            };

            window.plugins.pushNotification.unregister(successHandler, errorHandler, options);
        }

        return {
            register:register
        }
    }]);

function onNotification(e) {

    switch( e.event )
    {
        case 'registered':
            registerId = e.regid;
            var event = new CustomEvent("push-register",{
                detail: e.regid
            });
            document.dispatchEvent(event);
            break;

        case 'message':
            if(!e.payload.userId)return;
            window.location = "#/app/user/"+ e.payload.userId+'/ask';
            break;

        case 'error':
            console.log('ERROR');
            break;

        default:
            console.log('DEFAULT');
            break;
    }
}

window.onNotification = onNotification;