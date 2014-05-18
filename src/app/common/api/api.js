/**
 * In this module we define API functionality for the Drupalize.Me API.
 */

angular.module('dmeApp.api', ['ngResource'])

.config(['$httpProvider', function($httpProvider) {
	// This CSRF token is not required in Services 3.3. We shouldn't upgrade to
 	// services 3.5 until a full decoupled repository is in place.
  // $httpProvider.defaults.headers.common['X-CSRF-Token'] = '';
}])

.factory('Api', ['$resource', function($resource) {
	var Api = {
		Connect: $resource(api_path + '/system/connect'),
  	Series: $resource(api_path + '/series/:id', {id: '@id'}, {'query': {method: 'GET', isArray: false}}),
    Video: $resource(api_path + '/video/:id', {id: '@id'}),
	};

  return Api;
}]);

