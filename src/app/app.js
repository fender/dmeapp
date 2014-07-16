angular.module('dmeApp', [
  'ngRoute',
  'dmeApp.library',
  'dmeApp.series',
  'dmeApp.user',
  'dmeApp.video',
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
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

.controller('NavController', ['$scope', '$location', '$window', function($scope, $location, $window) {
  $scope.linkIsActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  // Untli we decouple and improve our search functionality, we simply redirect
  // the user to the Drupal back-end search page with the entered keywords.
  $scope.searchSubmit = function() {
    if ($scope.search) {
      $window.location = 'search/site/' + $scope.search;
    }
  };
}]);
