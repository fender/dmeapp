angular.module('dmeApp', ['ngRoute', 'dmeApp.library'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/library', {
      templateUrl: 'library.html',
      controller: 'LibraryController',
    })
    .when('/styleguide', {
      templateUrl: 'styleguide.html',
    })
    .otherwise({
      templateUrl: 'front.html',
    });

  $locationProvider.html5Mode(true);
}])
.controller('NavController', ['$scope', '$location', function($scope, $location) {
  $scope.linkIsActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
}]);