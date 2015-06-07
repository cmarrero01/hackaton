controllers.controller('SkillsCtrl',[
    '$scope',
    '$ionicLoading',
    'DeviceSvc',
    'SkillSvc',
    function($scope,$ionicLoading,DeviceSvc,SkillSvc){

        $scope.title = "Agregar Skills";

        $ionicLoading.show({template: 'Descubriendo skills...'});
        $scope.skills = [];
        $scope.mySkills = [];
        $scope.new = {};

        /**
         * @method addSkill
         * @param $event
         * @param skillName
         */
        $scope.addSkill = function($event,skillName){
            if(!$scope.mySkills || $scope.mySkills.length <= 0){
                $scope.mySkills = [];
            }
            if(!$event.target.checked){
                $scope.mySkills.splice($scope.mySkills.indexOf(skillName),1);
            }else{
                $scope.mySkills.push(skillName);
            }
            DeviceSvc.updateSkill($scope.mySkills,function(response){
                DeviceSvc.user.skill = $scope.mySkills;
            });
        };

        $scope.addNewSkill = function(){
            $scope.mySkills.push($scope.new.skill);
            $scope.skills.push({name:$scope.new.skill});
            DeviceSvc.updateSkill($scope.mySkills,function(response){
                DeviceSvc.user.skill = $scope.mySkills;
            });
            SkillSvc.add({name:$scope.new.skill},function(response){
                console.log('Added to list skills');
            });
            $scope.new.skill = '';
        };

        $scope.haveSkill = function(skillName){
            return ($scope.mySkills && $scope.mySkills.indexOf(skillName) !== -1);
        };

        getSkills();

        /**
         * Get all skills and my skills
         * @method getSkills
         */
        function getSkills(){
            $scope.mySkills = DeviceSvc.user.skill;
            $scope.checked = DeviceSvc.user.skill;
            SkillSvc.get(function(response){
                $ionicLoading.hide();
                $scope.skills = response.result;
            });
        }

    }]);