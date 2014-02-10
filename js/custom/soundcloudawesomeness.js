/**
 * @fileOverview Soundcloud Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

var soundcloudAwesomeModule = angular.module('SoundcloudAwesomeness', ['PureAwesomeness']);

soundcloudAwesomeModule.controller('SoundcloudAwesomenessCtrl', function ($scope, $http, $routeParams, $timeout) {

        $scope.urlParams = $.url().param();
        $scope.clientID = '';
        $scope.soundcloudTag = '';
        $scope.soundcloudTagEntered = '';
        $scope.items = [];
        $scope.nextItems = [];

        $scope.initController = function () {
            $scope.setInit();
            $scope.setWatch();
        };
        $scope.setInit = function () {
            $.ajax({
                url : "config/pureawesomeness.json",
                dataType : 'text',
                cache : false,
                success: function(data) {
                    var config = eval('(' + data + ')');
                    $scope.clientID = config.soundcloud_client_id;
                },
            });
        };
        $scope.setWatch = function () {
            $scope.$watch('awesomeTag', function(){
                if( $scope.awesomeTag != '' ){
                }
            });
        };
        $scope.getTracks = function (tag, callback) {
            var soundcloud_api = 'https://api.soundcloud.com/v1/tags/'+tag+'/media/recent?client_id='+$scope.clientID+'&callback=JSON_CALLBACK'
            //console.log("API: " + soundcloud_api);
            $http.jsonp(soundcloud_api)
                .success(callback)
                .error(function (oData, status) {
                    var errorMsg = oData['error'] || null;
                    if (errorMsg && status === 403) {
                        alert(errorMsg);
                    }
                });
        };
    })
;

