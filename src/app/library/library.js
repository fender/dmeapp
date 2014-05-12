angular.module('dmeApp.library', ['dmeApp.video'])

.controller('LibraryController', ['$scope', 'VideoService', function($scope, VideoService) {
	// Declare default library filter parameters.
	$scope.params = {
		sort: 'created',
		keywords: '',
		types: {
			'Series': true,
			'Video': false,
		},
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

	// When a parameters value is changed, update the library results.
	// Organize videos into the series on the client side.
	$scope.$watch('params.types', function() {
		// This is being triggered for every key entry on keywords too.
		console.log($scope.params);
  }, true);

	// Can we simplify this? Do we need 'var videos'?
	// Add to .run?
  var videos = VideoService.query($scope.params, function() {
  	$scope.videos = videos;
  });
}]);