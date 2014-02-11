/**
 * @fileOverview Soundcloud Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

var soundcloudAwesomeModule = angular.module('SoundcloudAwesomeness', ['PureAwesomeness']);

soundcloudAwesomeModule.controller('SoundcloudAwesomenessCtrl', function ($scope, $http, $routeParams, $timeout) {

        $scope.clientID = '';
        $scope.redirectURI = '';
        $scope.soundcloudTag = '';
        $scope.items = [];
        $scope.nextItems = [];
        $scope.item = {};
        $scope.itemIndex = 0;
        $scope.itemDisplayID = -1;
        $scope.isTimerRunning = false;
        $scope.initializedSC = false;

        $scope.makeAPICall = function (callback) {
            $.ajax({
                url : "config/pureawesomeness.json",
                dataType : 'text',
                cache : false,
                success: function(data) {
                    var config = eval('(' + data + ')');
                    $scope.clientID = config.soundcloud_client_id;
                    $scope.redirectURI = config.redirect_uri;
                    callback();
                },
            });
        };
        $scope.initController = function () {
            $scope.setInit();
            $scope.setWatch();
        };
        $scope.setInit = function () {
            if( $scope.awesomeTag != '' ){
                $scope.soundcloudTag = $scope.awesomeTag;
            }
            $scope.initializedSC = false;
        };
        $scope.setWatch = function () {
            $scope.$watch('awesomeTag', function(){
                if( $scope.awesomeTag != '' ){
                    $scope.tagUpdated($scope.awesomeTag);
                }
            });
            $scope.$watch('item', $scope.itemWatchCallback );
            $scope.$watch('items', $scope.itemsWatchCallback );
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
        $scope.tagUpdated = function (tag) {
            $scope.soundcloudTag = tag;
            $scope.makeAPICall($scope.connectSoundcloud);
        };
        $scope.tagClicked = function (tag) {
            $scope.updateAwesomeTag(tag);
        };
        $scope.connectSoundcloud = function () {
            console.log("SC Client ID: " + $scope.clientID);
            console.log("SC Redirect URI: " + $scope.redirectURI);

            if( $scope.initializedSC == false){
            // initialize client with app credentials
                SC.initialize({
                    client_id: $scope.clientID,
                    redirect_uri: $scope.redirectURI
                });

                // initiate auth popup
                SC.connect(function() {
                    SC.get('/me', function(me) { 
                        console.log('Hello, ' + me.username); 
                    });
                });
                $scope.initializedSC = true;
            }
            $scope.getTracks($scope.soundcloudTag);
        };
        $scope.getTracks = function (tag) {
            SC.get('/tracks', { tags: tag, limit: 5 }, function(tracks) {
                $scope.items = tracks;
                console.log($scope.items);
                if( $scope.items.length >= 1 ){
                    $.each($scope.items, function(index,item){
                        $scope.items[index]['tag_array'] = item.tag_list.split(" ");
                    });
                    $scope.$apply();
                    $.each($scope.items, function(index,item){
                        SC.oEmbed(item.uri, { iframe: false, show_comments: false},document.getElementById(item.id));
                    });
                }
            });
        };
    })
;

