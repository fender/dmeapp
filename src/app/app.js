angular.module('dmeApp', ['ngRoute', 'dmeApp.api', 'dmeApp.library'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/videos', {
      templateUrl: 'dist/library.html',
      controller: 'LibraryController',
    })
    .when('/styleguide', {
      templateUrl: 'dist/styleguide.html',
    })
    .otherwise({
      templateUrl: 'dist/front.html',
    });

  $locationProvider.html5Mode(true);
}])

.controller('NavController', ['$scope', '$location', function($scope, $location) {
  $scope.linkIsActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
}]);
