/**
 * @fileOverview Pure Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */


var pureAwesomenessModule = angular.module('PureAwesomeness', [
  'ngRoute',
  'SearchAwesomeness',
  'InstagramAwesomeness',
  'SoundcloudAwesomeness'
]);

pureAwesomenessModule.directive("navbar", function () {
        return {
            restrict: 'E',
            templateUrl: 'html/navbar.html',
            replace: true
        };
    });

pureAwesomenessModule.directive("searchbox", function () {
        return {
            restrict: 'E',
            templateUrl: 'html/searchbox.html',
            replace: true
        };
    });

pureAwesomenessModule.directive("notification", function () {
        return {
            restrict: 'E',
            templateUrl: 'html/notification.html',
            replace: true
        };
    });

pureAwesomenessModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/instagram', {
        templateUrl: 'html/instagram.html',
        controller: 'InstagramAwesomenessCtrl'
      }).
      when('/soundcloud', {
        templateUrl: 'html/soundcloud.html',
        controller: 'SoundcloudAwesomenessCtrl'
      }).
      otherwise({
        redirectTo: '/instagram'
      });
  }]);

pureAwesomenessModule.controller('PureAwesomenessCtrl', function($scope, $timeout) {

        $scope.notification = '';
        $scope.awesomeTag = '';
        $scope.updateNotification = function(msg){
            $scope.notification = msg;
            $timeout(function(){ $scope.notification = '';}, 3000);
        }
        $scope.updateAwesomeTag = function(tag){
            $scope.awesomeTag = tag;
        }
    })
;


