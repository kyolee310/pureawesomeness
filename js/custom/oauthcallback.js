/**
 * @fileOverview OAuthCallback JS 
 * @requires [AngularJS] 
 * Author: Kyo Lee 
 * Email: kyolee310@gmail.com
 *
 */

// Reference: https://github.com/enginous/angular-oauth/blob/master/src/js/angularOauth.js
var oAuthCallbackModule = angular.module('OAuthCallback', []);


oAuthCallbackModule.controller('OAuthCallbackCtrl', function($scope, $location) {

    /**
     * Parses an escaped url query string into key-value pairs.
     *
     * (Copied from Angular.js in the AngularJS project.)
     *
     * @returns Object.<(string|boolean)>
     */
    function parseKeyValue(/**string*/keyValue) {
      var obj = {}, key_value, key;
      angular.forEach((keyValue || "").split('&'), function(keyValue){
        if (keyValue) {
          key_value = keyValue.split('=');
          key = decodeURIComponent(key_value[0]);
          obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
        }
      });
      return obj;
    }

    var queryString = $location.path().substring(1);  // preceding slash omitted
    var params = parseKeyValue(queryString);
    //console.log("PARAMS: " + JSON.stringify(params));

    // TODO: The target origin should be set to an explicit origin.  Otherwise, a malicious site that can receive
    //       the token if it manages to change the location of the parent. (See:
    //       https://developer.mozilla.org/en/docs/DOM/window.postMessage#Security_concerns)

    window.opener.postMessage(params, "*");
    window.close();
  });







