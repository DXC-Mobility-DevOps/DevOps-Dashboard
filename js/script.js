//var app = angular.module('formApp', ['nvd3'])

// app.config(function($locationProvider, $routeProvider) {
//     $locationProvider.hashPrefix("!");
//     $locationProvider.html5Mode(false);
//     $routeProvider
//     .when("/", {
//         templateUrl : "dashboard.html",
//         controller:DashboardCtrl
//     });
// })


   



    // our controller for the form
    // =============================================================================
    app.controller('formController', function ($scope, $rootScope, $timeout) {

        $scope.projects = ["AHOLD","United Airlines", "AIMIA"];
        $scope.buildStatusText  = [
            "Checking for code change. Polling GIT repository ...",
            "Building project ...",
            "Running junit test cases ...",
            "Espresso test cases and android-instrumentation test cases ...",
            "Publishing to internal app distribution ...",
            "Build generated. Please click on Download Last Stable Build."
        ];
        $rootScope.selection = 0;
        $scope.buildStatus = [];
        
        $scope.buildStatusList1 = [
            {
                "buildType":"Last Stable Build",
                "buildNumber":"15",
                "ExecutedOn": "06/12/2016",
                "TiggredBy":"SCM Change"
            },
            {
                "buildType":"Last Unstable Build ",
                "buildNumber":"12",
                "ExecutedOn": "15/10/2016",
                "TiggredBy":"Daily Build"
            },
            {
                "buildType":"Current Release Version",
                "buildNumber":"10",
                "ExecutedOn": "11/11/2016",
                "TiggredBy":"Manual"
            },
            {
                "buildType":"Previous Release Version",
                "buildNumber":"6",
                "ExecutedOn": "11/06/2016",
                "TiggredBy":"Manual"
            }
            
        ];
        $scope.buildStatusList2 = [
            {
                "buildType":"Last Stable Build",
                "buildNumber":"12",
                "ExecutedOn": "05/12/2016",
                "TiggredBy":"SCM Change"
            },
            {
                "buildType":"Last Unstable Build ",
                "buildNumber":"18",
                "ExecutedOn": "15/11/2016",
                "TiggredBy":"Manual"
            },
            {
                "buildType":"Current Release Version",
                "buildNumber":"20",
                "ExecutedOn": "29/11/2016",
                "TiggredBy":"Manual"
            },
            {
                "buildType":"Previous Release Version",
                "buildNumber":"6",
                "ExecutedOn": "11/06/2016",
                "TiggredBy":"Manual"
            }
        ];
        $scope.buildStatusList3 = [
            {
                "buildType":"Last Stable Build",
                "buildNumber":"15",
                "ExecutedOn": "06/12/2016",
                "TiggredBy":"Daily Build"
            },
            {
                "buildType":"Last Unstable Build ",
                "buildNumber":"20",
                "ExecutedOn": "15/10/2016",
                "TiggredBy":"Manual"
            },
            {
                "buildType":"Current Release Version",
                "buildNumber":"20",
                "ExecutedOn": "25/11/2016",
                "TiggredBy":"Manual"
            },
            {
                "buildType":"Previous Release Version",
                "buildNumber":"6",
                "ExecutedOn": "11/06/2016",
                "TiggredBy":"Manual"
            }
        ];

        $scope.buildStatus =  $scope.buildStatusList1;

        $scope.projectClick =  function(position){
        
            $rootScope.selection  = position;
            $scope.progressTimer  = 0;
            if(position == 0){
                $scope.buildStatus =  $scope.buildStatusList1;
            }else if(position == 1){
                $scope.buildStatus =  $scope.buildStatusList2;
            }else{
                $scope.buildStatus =  $scope.buildStatusList3;
            }

             $scope.$broadcast ('someEvent', position);
        };

       

        $scope.progressTimer  = 0;
        $scope.INTERVAL  =2000;
       

        function callAtTimeout() {
            $scope.progressTimer = $scope.progressTimer+1;
            console.log("Timeout occurred");
            if($scope.progressTimer <= 6){
                if($scope.progressTimer == 1){
                     $timeout(callAtTimeout, 5000);
                }else if($scope.progressTimer == 2){//build
                     $timeout(callAtTimeout, 15000);
                }else if($scope.progressTimer == 3){//uni test
                     $timeout(callAtTimeout, 10000);
                }else if($scope.progressTimer == 4){//ui test
                     $timeout(callAtTimeout, 10000);
                }else if($scope.progressTimer == 5){//deploy
                     $timeout(callAtTimeout, 5000);
                }else{
                    $timeout(callAtTimeout, $scope.INTERVAL);
                }
               
            }
            
        }

        $scope.OnBuildButtonClicked =  true;
        $scope.OnBuildBtnClick =  function(){
            $scope.OnBuildButtonClicked =  true;
            if($scope.progressTimer  == 0){
                 $timeout(callAtTimeout, $scope.INTERVAL);
            }else if($scope.progressTimer  >=6 ){
                $scope.progressTimer  = 0;
                 $timeout(callAtTimeout, $scope.INTERVAL);
            }else{
                alert("Build in progress !");
            }
        }

        $scope.OnUIUXBtnClick =  function(){
            $scope.OnBuildButtonClicked =  false;
            
        }

    });