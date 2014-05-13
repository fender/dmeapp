angular.module('dmeApp.library', ['dmeApp.video'])

.controller('LibraryController', ['$scope', 'VideoService', function($scope, VideoService) {
	// Declare default library filter parameters.
	$scope.params = {
		group: true,
		sort: 'created',
		keywords: '',
		categories: {
			'Module Development': false,
			'Theming': false,
			'Site Building': false,
			'Site Administration': false,
			'Backend and Infrastructure': false,
			'Community': false,
		},
		versions: {
			'Drupal 6': false,
			'Drupal 7': false,
			'Drupal 8': false,
		},
		options: {
			'Not Watched': false,
			'Watched': false,
			'Closed Captions': false,
		},
	};

  $scope.updateResults = function() {
	  VideoService.query($scope.params, function(videos) {
	  	console.log(videos);
	  	$scope.videos = videos;
	  });
  };

	// When a parameters value is changed, update the library results.
	$scope.$watch('params', function(newVal, oldVal) {
		// Ignore keyword filter changes here.
		if (newVal.keywords === oldVal.keywords) {
			$scope.updateResults();
		}
  }, true);

	// Stores current video results.
	$scope.videos = {};

	// Load initial results.
	$scope.updateResults();
}]);