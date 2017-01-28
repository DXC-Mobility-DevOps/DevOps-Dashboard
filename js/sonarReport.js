app.controller('SonarCtrl', ['$scope', function ($scope, $rootScope) {


    $scope.sonarReport = [
        { "percentage" : "25.04%" ,"lines" : 123, "files" : 7 , "functions":14 , "complexity":11 },
        { "percentage" : "45.50%" ,"lines" :91, "files" : 3 , "functions":10 , "complexity":10 },
        { "percentage" : "95.80%" ,"lines" :87, "files" : 4 , "functions":18 , "complexity":3 }
    ];



$scope.$on('someEvent', function(e, arg) {
	//alert(arg);
        $scope.$parent.msg = $scope.renderChart(arg);
    });

$scope.renderChart =  function(selection){


	var qualityIndex =  parseFloat($scope.sonarReport[selection].percentage);  //$scope.sonarReport[1].percentage;

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
	                       '<span style="font-size:12px;color:silver">percentage (%)</span></div>'
	            },
	            tooltip: {
	                valueSuffix: ' %'
	            }
	        }]

	    }));

	});
};

}]);
