angular.module('dmeApp', [
  'ngRoute',
  'dmeApp.api',
  'dmeApp.series',
  'dmeApp.video',
  'dmeApp.library'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/videos', {
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

.value('versionTaxonomy', {
  1044: 'Drupal 6',
  1045: 'Drupal 7',
  1046: 'Drupal 8',
})

.value('categoryTaxonomy', {
  210: 'Site Building',
  208: 'Theming',
  207: 'Module Development',
  216: 'Backend and Infrastructure',
  211: 'Site Administration',
  214: 'Management and Strategy',
  219: 'Community',
})

.controller('NavController', ['$scope', '$location', function($scope, $location) {
  $scope.linkIsActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
}]);
