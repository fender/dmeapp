/**
 * In this module we define common API functionality such as paths,
 * authentication and validation.
 */

angular.module('dmeApp.api', ['ngResource'])

.config(['$httpProvider', function($httpProvider) {
	// This CSRF token is not required in Services 3.3. We shouldn't upgrade to
 	// services 3.5 until a full decoupled repository is in place.
  // $httpProvider.defaults.headers.common['X-CSRF-Token'] = '';
}])

// TODO move this to UserService or a User service value?
.run(['$rootScope', 'Api', function($rootScope, Api) {
	$rootScope.user = {};

	Api.Connect.save(null, function(data) {
		if (angular.isDefined(data.user)) {
			$rootScope.user.uid = data.user.uid;
			$rootScope.user.loggedIn = $rootScope.user.uid > 0;
		}
	}, function() {
		$rootScope.user.loggedIn = false;
	});
}])

.factory('Api', ['$resource', function($resource) {
  return {
  	Connect: $resource(api_path + '/system/connect'),
  	Series: $resource(api_path + '/series/:id', {id: '@id'}),
    Video: $resource(api_path + '/video/:id', {id: '@id'}),
  };
}]);

