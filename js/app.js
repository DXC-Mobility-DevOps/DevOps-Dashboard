var app = angular.module('formApp', ['nvd3', 'ngResource','percentCircle-directive'])
    .constant('CONF', {
        baseUrl: 'http://16.181.234.214:8082',
        loginEndPoint: 'http://16.181.234.214:8082/DevOpsServer/user/v01/isAuthenticated/',
        getJenkinJobList: 'http://16.181.234.214:8080/api/json?pretty=true',
        getSonarCodeCoverage: 'http://16.181.234.214:9000/api/resources?metrics=coverage',
        detailedProjectStatus: 'http://16.181.234.214:8080/job/'
    })
    .service('Webservice', ['$resource', 'CONF', '$http',
        function Webservice($resource, CONF, $http) {
            this.inputData = [];
            this.inputPayload;
            // delete $http.defaults.headers.common['X-Requested-With'];
            this.getData = function (inputArray, callback) {
                var showError = this.showError;
                if (inputArray.type == 'GET') {

                    $http({
                        method: inputArray.type,
                        url: inputArray.url
                        //headers: { "crossOrigin": true }
                    })     // HTTP Method
                        .success(function (data) {
                            if (data == undefined) {
                                alert("There seems to be a problem with the server. Please try again");
                            } else if (data.length <= 0) {
                                alert("There seems to be a problem with the server. Please try again");
                            } else {
                                callback(data);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            showError(data, 404);
                        });
                }
                else if (inputArray.type == 'POST') {

                    $http({
                        method: 'POST',
                        url: inputArray.url
                        //crossOrigin: true
                        //data: this.inputPayload,

                    })
                        .success(function (result_data) {
                            console.log("post webservice success from service :" + inputArray.url);
                            console.log(result_data);
                            if (result_data == undefined) {
                                alert("There seems to be a problem with the server. Please try again");
                            } else if (result_data.length <= 0) {
                                alert("There seems to be a problem with the server. Please try again");
                            }// else {
                            callback(result_data);
                            // }
                        })
                        .error(function (repsonse, status) {
                            alert("post webservice failed::" + status);
                            alert("url=" + inputArray.url);
                        });
                }
            }
            this.showError = function (data, status) {
                if (status == 0) {
                    alert('No Internet Connection');
                    return;
                } else if (status == 404) {
                    alert('We are sorry, but the page you re looking for is not available. Please try after sometime ');
                    return;
                } else if (status == 403) {
                    alert('We are sorry, your request could not be processed. Please try after sometime.');
                    return;
                } else if (status == 400) {
                    alert('We are sorry,  we are unable to process your request. We shall get back to you soon.');
                    return;
                } else if (status == 500) {
                    alert('We are sorry, your request could not be processed at the moment. Please try after sometime.');
                    return;
                } else {
                    alert('Uncaught Error');
                    return;
                }
            }
        }
    ]);
    // .config(['$httpProvider', function ($httpProvider) {
    //     console.log("enable cross domain calls");
    //      //Enable cross domain calls
    //     $httpProvider.defaults.useXDomain = true;
    //     //Remove the header used to identify ajax call  that would prevent CORS from working
    //     delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // }
    // ]);






















    // .factory('APIcallFactory', ['$resource', 'CONF',
    //     function ($resource, CONF) {
    //         return {
    //             get: function (endPoint, method) {
    //                 console.log("url : " + endPoint + "  type :" + method);
    //                 var resource = $resource(endPoint, {}, {
    //                     get: {

    //                         method: method || 'GET',
    //                         headers: {
    //                             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    //                             //'Accept-Encoding':'gzip, deflate, sdch',
    //                             'Upgrade-Insecure-Requests': '1',
    //                             //'Content-Security-Policy': 'upgrade-insecure-requests',
    //                             //'Origin':'*'
    //                             //'Access-Control-Allow-Origin': '*'
    //                         }
    //                     }
    //                 });

    //                 return resource.get().$promise;
    //             }
    //         };
    //     }
    // ]);