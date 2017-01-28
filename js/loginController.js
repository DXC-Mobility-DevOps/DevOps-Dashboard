app.controller('LoginCtrl', ['$scope', '$rootScope', 'CONF', 'Webservice', '$window','$location', function ($scope, $rootScope, CONF, Webservice, $window, $location) {

    $scope.user = 'admin';
    $scope.password = 'admin';
    $rootScope.projectList = [];


    $scope.doLogin = function () {
        console.log("Do Login for user:" + $scope.user + " password : " + $scope.password);
        //var response = APIcallFactory.get(CONF.loginEndPoint + $scope.user + "/" + $scope.password, "POST");
        Webservice.getData({
            url: CONF.loginEndPoint + $scope.user + "/" + $scope.password,
            type: 'POST',
            input: []
        }, function (data) {
            console.log("Login Response :" + data);
            //var json = $.xml2json(data);     
            $scope.fetchDashboardData();
            //$window.location.href = 'file:///C:/Users/ksapar/Documents/DevOps/Source/hpe-mobility-devops-dashboard/dashboard.html'; //'/dashboard.html';
             $window.location.href = 'file:///C:/DevOps Lib/hpe-mobility-devops-dashboard/hpe-mobility-devops-dashboard/dashboard.html'; //'/dashboard.html';
            //$window.location == "#/dashboard.html";
            //$location.url('/dashboard.html');
        }); 

    };



    $scope.fetchDashboardData = function () {
        console.log("fetchDashboardData");
        Webservice.getData({
            url: CONF.getJenkinJobList,
            type: 'GET',
            input: []
        }, function (data) {
            $scope.jenkinResponse = data;
            console.log($scope.jenkinResponse);
            Webservice.getData({
                url: CONF.getSonarCodeCoverage,
                type: 'GET',
                input: []
            }, function (data) {
                $scope.sonarResponse = data;
                console.log($scope.sonarResponse);
                for (var i = 0; i < $scope.jenkinResponse.jobs.length; i++) {
                    var index = $scope.sonarResponse.indexOf($scope.sonarResponse.filter(function (item) {
                        return item.key == $scope.jenkinResponse.jobs[i].name
                    })[0]);
                    // console.log("index >>> " + index);
                    var color = '';
                    if ($scope.jenkinResponse.jobs[i].color === 'blue') {
                        color = 'success';
                    } else if ($scope.jenkinResponse.jobs[i].color === 'red') {
                        color = 'failed';
                    } else if ($scope.jenkinResponse.jobs[i].color === 'blue_anime' || $scope.jenkinResponse.jobs[i].color === 'aborted_anime') {
                        color = 'building';
                    } else {
                        color = 'aborted';
                    }
                    $rootScope.projectList.push({
                        Project_name: $scope.jenkinResponse.jobs[i].name,
                        Status: color,
                        Version_number: $scope.sonarResponse[index].version,
                        Build_date: $scope.sonarResponse[index].date,
                        Code_coverage: $scope.sonarResponse[index].msr[0].val
                    });
                }
                console.log($rootScope.projectList);

            });


        });


    };


}]);