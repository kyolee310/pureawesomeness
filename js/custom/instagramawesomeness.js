/**
 * @fileOverview Instagram Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

var instagramAwesomeModule = angular.module('InstagramAwesomeness', ['PureAwesomeness']);

instagramAwesomeModule.controller('InstagramAwesomenessCtrl', function ($scope, $http, $routeParams, $timeout) {

        $scope.urlParams = $.url().param();
        $scope.clientID = '';
        $scope.instagramTag = '';
        $scope.instagramTagEntered = '';
        $scope.items = [];
        $scope.nextItems = [];
        $scope.item = {};
        $scope.itemIndex = 0;
        $scope.itemDisplayID = -1;
        $scope.isTimerRunning = false;

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
                    $scope.clientID = config.instagram_client_id;
                },
            });
        };
        $scope.setWatch = function () {
            $scope.$watch('awesomeTag', function(){
                if( $scope.awesomeTag != '' ){
                    $scope.tagUpdated($scope.awesomeTag);
                }
            });
            $scope.$watch('item', $scope.itemWatchCallback );
            $scope.$watch('items', $scope.itemsWatchCallback );
            $scope.$watch('itemIndex', $scope.itemIndexWatchCallback );
        };
        $scope.itemWatchCallback = function () {
            if( $scope.items ){
                $scope.itemDisplayID = $scope.item.id;
            }
        };
        $scope.itemsWatchCallback = function () {
            if( $scope.items && $scope.items.length >= 1 ){
                $scope.item = $scope.items[$scope.itemIndex];
            }
        };
        $scope.itemIndexWatchCallback = function () {
            if( $scope.isTimerRunning && $scope.nextItems.length == 0 && $scope.itemIndex == $scope.items.length - 3 ){
                $scope.getNextImages();
            }
        };
        $scope.isShow = function (item) {
            if( $scope.itemDisplayID == item.id){
                return true;
            }
            return false;
        };
        $scope.instagramItemUpdate = function (offset) {
            $scope.itemIndex = $scope.itemIndex + offset;
            if( $scope.itemIndex < 0){
                $scope.itemIndex = $scope.items.length-1;
            }
            if( $scope.itemIndex >= $scope.items.length){
               $scope.itemIndex = 0;
               if( $scope.isTimerRunning && $scope.nextItems ){
                   $scope.items = $scope.nextItems;
                   $scope.nextItems = [];
               }
            }
            $scope.item = $scope.items[$scope.itemIndex];
        };
        $scope.startTimer = function() {
            $scope.promise = $timeout(function(){ $scope.instagramItemUpdate(1); $scope.startTimer()}, 5000);
            $scope.isTimerRunning = true;
        };
        $scope.pauseTimer = function() {
            $timeout.cancel($scope.promise);
            $scope.isTimerRunning = false;
        };
        $scope.playButtonClass = function() {
           if( $scope.isTimerRunning ){
               return 'color-blue';
           }
           return undefined;
        };
        $scope.tagUpdated = function (tag) {
            $scope.instagramTag = tag;
            $scope.instagramTagUpdate();
        }
        $scope.tagClicked = function (tag) {
            $scope.updateAwesomeTag(tag);
        };
        $scope.instagramTagUpdate = function () {
            $scope.instagramTagEntered = ($scope.instagramTag).replace(/\s/g, '');
            $scope.getImages($scope.instagramTagEntered, function(oData) {
                $scope.items = oData.data ? oData.data : [];
            });
            $scope.itemIndex = 0;
        };
        $scope.getImages = function (tag, callback) {
            var instagram_api = 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?client_id='+$scope.clientID+'&callback=JSON_CALLBACK'
            //console.log("API: " + instagram_api);
            $http.jsonp(instagram_api)
                .success(callback)
                .error(function (oData, status) {
                    var errorMsg = oData['error'] || null;
                    if (errorMsg && status === 403) {
                        alert(errorMsg);
                    }
                });
        };
        $scope.getNextImages = function() {
            $scope.getImages($scope.instagramTagEntered, function(oData) {
                $scope.nextItems = oData.data ? oData.data : [];
            });
        };
    })
;

