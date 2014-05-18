angular.module('dmeApp.user', [])

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

.factory('UserService', ['Api', function(Api) {
	// TODO don't use the $rootScope above but move this to UserService?
	return {};
}]);
