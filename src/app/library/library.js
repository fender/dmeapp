angular.module('dmeApp.library', [])

.controller('LibraryController', ['$scope', 'Api', 'categoryTaxonomy', 'versionTaxonomy',
	function($scope, Api, categoryTaxonomy, versionTaxonomy) {
	// Declare default library filter parameters.
	$scope.params = {
		keywords: '',
		categories: {},
		versions: {},
		not_watched: false,
		watched: false,
		closed_captions: false,
		page: 1,
		pagesize: 15,
		group_by_series: true,
		sort: 'created',
	};

	// Populate the taxonomy filters.
	angular.forEach(categoryTaxonomy, function(name, tid) {
		$scope.params.categories[tid] = {name: name, selected: false};
	});
	angular.forEach(versionTaxonomy, function(name, tid) {
		$scope.params.versions[tid] = {name: name, selected: false};
	});

  $scope.updateResults = function() {
  	// Clear previous results.
  	$scope.items = {};

  	// Temporarily disable filter interaction.
  	$scope.disableFilters = true;

  	// We make a copy of the parameters so as to not affect the scope.
  	var params = angular.copy($scope.params);

  	// Remove non-selected terms from taxonomy filters.
  	params.categories = $scope.selectedTerms(params.categories);
  	params.versions = $scope.selectedTerms(params.versions);

  	// Call our API for the new results.
  	var resource = params.group_by_series ? 'Series' : 'Video';
		$scope.items = Api[resource].query(params, function() {
	  	$scope.disableFilters = false;
	  });
  };

  // Helper function that returns an array of selected term IDs from a taxonomy
  // filter object.
  $scope.selectedTerms = function(object) {
  	var terms = [];
  	angular.forEach(object, function(term, tid) {
  		if (term.selected) {
  			terms.push(tid);
  		}
  	});
  	return terms;
  };

	// When a parameters value is changed, update the library results.
	$scope.$watch('params', function(newValue, oldValue) {
		// Don't do anything if parameters didn't change. Also ignore keyword filter
		// changes as we handle that separately.
		if (newValue === oldValue || newValue.keywords !== oldValue.keywords) {
		  return;
		}

		$scope.updateResults();
  }, true);

	// Load initial results.
	$scope.updateResults();
}]);