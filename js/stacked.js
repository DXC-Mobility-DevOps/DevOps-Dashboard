app.controller('stackedCtrl', function($scope) {
  $scope.options = {
            chart: {
                type: 'stackedAreaChart',
                height: 240,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = [
            {
                "key" : "AppVersion_1.0" ,
                "values" : [
                     [ 1475778600000 , 0] , [ 1476210600000 , 2] , [ 1477765800000 , 0] , [ 1478284200000 , 2] , [ 1478284200000 , 1] ]
            },

            {
                "key" : "AppVersion_1.1" ,
                "values" : [ 
                    [ 1475778600000 , 1] , [ 1476210600000 , 8] , [ 1477765800000 , 2] , [ 1478284200000 , 4] , [ 1478284200000 , 0] ]
            }

        ]
});
