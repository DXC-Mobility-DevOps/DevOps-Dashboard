'use strict';

app.controller('DashboardCtrl', ['$scope', '$rootScope', 'CONF', 'Webservice', '$timeout', function ($scope, $rootScope, CONF, Webservice, $timeout) {

  //  $http.get("http://www.w3schools.com/angular/customers.php")
  // .then(function (response) {$scope.names = response.data.records;});

  $rootScope.projectList = [];
  $scope.headers = ["Project", "Status", "Version", "Build Date", "Code Coverage", "Trigger Build"];
  $scope.INTERVAL = 10000;
  $scope.autoSelect = 0;
  $scope.projectStatus = {};

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
          if (index < 0) {
            // $rootScope.projectList.push({
            //   Project_name: $scope.jenkinResponse.jobs[i].name,
            //   Status: color,
            //   Version_number: '',
            //   Build_date: '',
            //   Code_coverage: ''
            // });
          } else {
            $rootScope.projectList.push({
              Project_name: $scope.jenkinResponse.jobs[i].name,
              Status: color,
              Version_number: $scope.sonarResponse[index].version,
              Build_date: $scope.sonarResponse[index].date,
              Code_coverage: $scope.sonarResponse[index].msr[0].val
            });
          }

        }
        console.log($rootScope.projectList);
        $scope.autoSelect = 0;
        $scope.maxSelect = $rootScope.projectList.length;//10;
        console.log("inside dashboard controller " + $scope.maxSelect);
        $scope.startAutoSelectSub();

      });


    });


  };


  // $scope.getProjectStatus = function (projectName) {
  //   console.log("getProjectStatus :" + projectName);
  //   Webservice.getData({
  //     url: CONF.detailedProjectStatus + projectName + "/api/json",
  //     type: 'GET',
  //     input: []
  //   }, function (data) {
  //     $scope.projectStatus = {
  //       healthReport: data.healthReport[0].description,
  //       lastCompletedBuild: data.lastCompletedBuild,
  //       lastFailedBuild: data.lastFailedBuild,
  //       lastStableBuild: data.lastStableBuild,
  //       lastSuccessfulBuild: data.lastSuccessfulBuild,
  //       lastUnstableBuild: data.lastUnstableBuild,
  //       lastUnsuccessfulBuild: data.lastUnsuccessfulBuild
  //     }
  //     console.log($scope.projectStatus);
  //   });
  // };

  $scope.getProjectBuildDetails = function (projectName) {
    console.log("getProjectStatus :" + projectName);
    Webservice.getData({
      url: CONF.detailedProjectStatus + projectName + "/lastBuild/api/json",
      type: 'GET',
      input: []
    }, function (data) {
      $scope.lastBuildDetails = data;
      Webservice.getData({
        url: CONF.detailedProjectStatus + projectName + "/api/json",
        type: 'GET',
        input: []
      }, function (data) {
        $scope.projectStatus = {
          healthReport: data.healthReport[0].description,
          healthReportScore: data.healthReport[0].score,
          lastCompletedBuild: data.lastCompletedBuild,
          lastFailedBuild: data.lastFailedBuild,
          lastStableBuild: data.lastStableBuild,
          lastSuccessfulBuild: data.lastSuccessfulBuild,
          lastUnstableBuild: data.lastUnstableBuild,
          lastUnsuccessfulBuild: data.lastUnsuccessfulBuild,

          triggeredBy: $scope.lastBuildDetails.actions[0].causes[0].shortDescription,
          buildURL: $scope.lastBuildDetails.url,
          commitComment: $scope.lastBuildDetails.changeSet.items[0].comment,
          commitDate: $scope.lastBuildDetails.changeSet.items[0].date,
          fileChanges: $scope.lastBuildDetails.changeSet.items[0].affectedPaths,
          versionName: '',
          buildDate: $scope.lastBuildDetails.builtOn,
          authorName: $scope.lastBuildDetails.changeSet.items[0].author.fullName,
          authorEmail: $scope.lastBuildDetails.changeSet.items[0].authorEmail
        }
        console.log($scope.projectStatus);
        //$scope.$digest();

      });
    });
  };
  // $scope.getProjectStatus("HPEIoT");

  function startAutoSelect() {
    $scope.autoSelect = $scope.autoSelect + 1;
    console.log("timer up" + $scope.autoSelect);
    if ($scope.autoSelect >= $scope.maxSelect) {
      $scope.autoSelect = 0;
    }
    console.log("timer up" + $scope.autoSelect + "  project name : " + $rootScope.projectList[$scope.autoSelect].Project_name);
    $scope.getProjectBuildDetails($rootScope.projectList[$scope.autoSelect].Project_name);
    $scope.renderChart($rootScope.projectList[$scope.autoSelect].Code_coverage);
    //$scope.healthReport($scope.projectStatus.healthReportScore);
    if ($scope.autoSelect < $scope.maxSelect) {
      $timeout(startAutoSelect, $scope.INTERVAL);
    }

  }

  $scope.startAutoSelectSub = function () {
    $scope.getProjectBuildDetails($rootScope.projectList[$scope.autoSelect].Project_name);
    $scope.renderChart($rootScope.projectList[$scope.autoSelect].Code_coverage);
    //$scope.healthReport($scope.projectStatus.healthReportScore);
    $timeout(startAutoSelect, $scope.INTERVAL);
  };

  $scope.healthReport = function (score) {
    $('#circle').circleProgress({
      value: score * 0.01,
      size: 80,
      fill: {
        gradient: ["red", "orange"]
      }
    }).on('circle-animation-progress', function (event, progress) {
      $(this).find('strong').html(Math.round(100 * progress) + '<i>%</i>');
    });
  };

  $scope.doClick = function (event) {

    var x = event.clientX;
    var y = event.clientY;
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;
    alert(x, y, offsetX, offsetY);

    /// These are the 2 new lines, see you target the canvas element then apply it to getContext
    var canvasElement = document.getElementById("canvas");
    var ctx = canvasElement.getContext("2d");

    //draw a circle
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

  };


  // $scope.jobListResponse =

  //   [{

  //     Project_name: "UnitedAirlines",
  //     Status: "build",
  //     Version_no: "UnitedAirlines‐4.1_8",
  //     Build_date: "2017‐01‐13T04:22:20+0000",
  //     Code_coverage: "40%"
  //   },
  //     {

  //       Project_name: "DevOps",
  //       Status: "build",
  //       Version_no: "DevOps‐1.0.0_1",
  //       Build_date: "2017‐01‐12T13:33:21+0000",
  //       Code_coverage: "10%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     },
  //     {
  //       Project_name: "AmericanAirlines",
  //       Status: "build",
  //       Version_no: "AmericanAirlines‐2.0.1_3",
  //       Build_date: "2017‐01‐14T03:30:26+0000",
  //       Code_coverage: "50%"
  //     }

  //   ];




  $scope.renderChart = function (value) {


    var qualityIndex = parseFloat(value);  //$scope.sonarReport[1].percentage;
    console.log("code coverage  :" + qualityIndex);

    $(function () {

      var gaugeOptions = {

        chart: {
          type: 'solidgauge'
        },

        title: null,

        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },

        tooltip: {
          enabled: false
        },
        exporting: {
          enabled: false
        },

        // the value axis
        yAxis: {
          stops: [
            [0.1, '#DF5353'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#55BF3B'] // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },

        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      };

      // The speed gauge
      var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Code Quality',
            style: {
              display: 'none'
            }
          }
        },

        credits: {
          enabled: false
        },

        series: [{
          name: 'Speed',
          data: [qualityIndex],
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
            '<span style="font-size:9px;color:#696969">Code Coverage</span></div>'
          },
          tooltip: {
            valueSuffix: ' %'
          }
        }]

      }));

    });
  };



}]);