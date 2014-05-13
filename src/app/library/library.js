angular.module('dmeApp.library', [])

.controller('LibraryController', ['$scope', 'SeriesService', 'VideoService', function($scope, SeriesService, VideoService) {
	// Declare default library filter parameters.
	$scope.params = {
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
		not_watched: false,
		watched: false,
		closed_captions: false,
		page: 1,
		pagesize: 15,
		group_by_series: true,
		sort: 'created',
	};

  $scope.updateResults = function() {
  	// Remove any previous results.
  	$scope.items = {};

  	// Temporarily disable filter interaction.
  	$scope.disableFilters = true;

  	var service = $scope.params.group_by_series ? SeriesService : VideoService;
		service.query($scope.params, function(items) {
	  	$scope.items = items;
	  	$scope.disableFilters = false;
	  });
  };

	// When a parameters value is changed, update the library results.
	$scope.$watch('params', function(newValue, oldValue) {
		// Don't do anything if parameters didn't change. Also ignore keyword filter
		// changes as we handle that separately.
		if (newValue === oldValue || newValue.keywords === oldValue.keywords) {
		  return;
		}

		$scope.updateResults();
  }, true);

	// Load initial results.
	$scope.updateResults();
}]);