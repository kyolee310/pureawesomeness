/**
 * @fileOverview Search Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

var awesomeModule = angular.module('SearchAwesomeness', ['PureAwesomeness']);

awesomeModule.controller('SearchAwesomenessCtrl', function ($scope, $timeout) {

        $scope.searchTag = '';

        $scope.initController = function () {
            $scope.setWatch();
        };
        $scope.setWatch = function (){
            $scope.$watch('awesomeTag', function() {
                $scope.searchTag = $scope.awesomeTag;
            });
        };
        $scope.searchTagInputBoxKeypress = function (ev) {
            if (ev.which==13){
                 $scope.searchTagUpdate();
            }
        };
        $scope.searchTagUpdate = function () {
            var searchTagFiltered = ($scope.searchTag).replace(/\s/g, '');
            $scope.updateAwesomeTag('');
            $timeout(function(){$scope.updateAwesomeTag(searchTagFiltered);}, 100);
        };
    })
;

