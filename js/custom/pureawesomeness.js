/**
 * @fileOverview Pure Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

var awesomeModule = angular.module('PureAwesomeness', []);


awesomeModule.directive("navbar", function () {
        return {
            restrict: 'E',
            templateUrl: 'html/navbar.html',
            replace: true
        };
    });

awesomeModule.directive("instagram", function () {
        return {
            restrict: 'E',
            templateUrl: 'html/instagram.html',
            replace: true
        };
    });


awesomeModule.controller('PureAwesomenessCtrl', function ($scope, $http, $timeout) {
        $scope.urlParams = $.url().param();
        $scope.clientID = '';
        $scope.instagramTag = '';
        $scope.items = [];
        $scope.item = {};
        $scope.itemIndex = 0;
        $scope.isItem = false;
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
                    $scope.clientID = config.client_id;
                },
            });
        };
        $scope.setWatch = function () {
            $scope.$watch('items', $scope.itemsWatchCallback );
        };
        $scope.itemsWatchCallback = function () {
            if( $scope.items.length >= 1 ){
                $scope.item = $scope.items[$scope.itemIndex];
                $scope.isItem = true;
            }
        };
        $scope.instagramItemUpdate = function (offset) {
            $scope.isItem = false;
            $scope.itemIndex = $scope.itemIndex + offset;
            if( $scope.itemIndex < 0){
                $scope.itemIndex = 0;
            }
            if( $scope.itemIndex >= $scope.items.length){
                $scope.itemIndex = 0;
            }
            $scope.item = $scope.items[$scope.itemIndex];
            $scope.isItem = true;
            $scope.promise = $timeout(function(){ $scope.instagramItemUpdate(1);}, 5000);
        };
        $scope.pauseTimer = function() {
            $timeout.cancel($scope.promise);
        };
        $scope.instagramTagInputBoxKeypress = function (ev) {
            if (ev.which==13)
                 $scope.instagramTagUpdate();
        };
        $scope.instagramTagUpdate = function () {
            $scope.instagramTag = ($scope.instagramTag).replace(/\s/g, '');
            $('#span-instagram-tag-clicked').text( "#" + $scope.instagramTag);
            $scope.getImages($scope.instagramTag);
        };
        $scope.getImages = function (tag) {
            var instagram_api = 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?client_id='+$scope.clientID+'&callback=JSON_CALLBACK'
            //console.log("API: " + instagram_api);
            $scope.isItem = false;
            $http.jsonp(instagram_api).success(function(oData) {
                var results = oData.data ? oData.data : [];
                $scope.items = results;
                //console.log("ITEMS: " + JSON.stringify(results));
                if ($.url().param('access_token')) {
                    // PLACE HOLDER FOR ACCESS TOKEN AUTH
                }
            }).error(function (oData, status) {
                var errorMsg = oData['error'] || null;
                if (errorMsg && status === 403) {
                    alert(errorMsg);
                }
            });
        };
    })
;

