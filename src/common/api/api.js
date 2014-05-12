/**
 * In this module we define common API functionality such as paths,
 * authentication and validation.
 */

angular.module('dmeApp.api', ['ngResource'])

.config(['$httpProvider', function($httpProvider) {
	// The CSRF token is not required in Services 3.3. We shouldn't upgrade to
 	// services 3.5 until a full decoupled repository is in place.
  // $httpProvider.defaults.headers.common['X-CSRF-Token'] = '';
}])

.run(['$rootScope', 'Api', function($rootScope, Api) {
	$rootScope.user = {};

	Api.Connect.save(null, function(data) {
		if (angular.isDefined(data.user)) {
			$rootScope.user.uid = data.user.uid;
			$rootScope.user.loggedIn = $rootScope.user.uid > 0;
		}
	});
}])

.factory('Api', ['$resource', function($resource) {
  // var api_path = 'http://drupalize.me/api/v1';
  var api_path = 'http://local.drupalize.me:8082/api/v1';

  return {
  	Connect: $resource(api_path + '/system/connect'),
    Videos: $resource(api_path + '/videos/:id', {id: '@id'}),
  };
}]);

