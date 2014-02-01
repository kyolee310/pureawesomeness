/**
 * @fileOverview Pure Awesomeness JS 
 * @requires [AngularJS, jQuery, purl.js] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */


angular.module('PureAwesomeness', [])
    .controller('PureAwesomenessCtrl', function ($scope, $http) {
        $scope.urlParams = $.url().param();
        $scope.clientID = '';
        $scope.instagramTag = '';
        $scope.items = [];
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

