angular.module('dmeApp.library', [
  'dmeApp.api',
  'dmeApp.pager'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/videos', {
    templateUrl: 'library.html',
    controller: 'LibraryController',
  });
}])

.controller('LibraryController', ['$scope', 'selectedTermsFilter', 'Api', 'categoryTaxonomy', 'versionTaxonomy',
	function($scope, selectedTermsFilter, Api, categoryTaxonomy, versionTaxonomy) {
	// Declare default library filter parameters.
	$scope.params = {
		categories: {},
		versions: {},
		not_watched: false,
		watched: false,
		closed_captions: false,
		page: 1,
		pagesize: 15,
		group_by_series: true,
		sort: 'title',
	};

	// Populate the taxonomy filters.
	angular.forEach(categoryTaxonomy, function(name, tid) {
		$scope.params.categories[tid] = {name: name, selected: false};
	});
	angular.forEach(versionTaxonomy, function(name, tid) {
		$scope.params.versions[tid] = {name: name, selected: false};
	});

	// This function is called every time we want to retrieve new media results.
  $scope.updateResults = function() {
  	// Clear previous results.
  	$scope.results = {};

  	// Temporarily disable filter interaction.
  	$scope.disableFilters = true;

  	// We make a copy of the parameters so as to not affect the scope.
  	var params = angular.copy($scope.params);

  	// Convert selected terms into a comma delimited string.
  	params.categories = selectedTermsFilter(params.categories, ',');
    params.versions = selectedTermsFilter(params.versions, ',');

    // API requires a zero-based index for the pager.
    params.page -= 1;

  	// Call our API for the new results.
  	var resource = params.group_by_series ? 'Series' : 'Video';
		$scope.results = Api[resource].query(params, function() {
	  	$scope.disableFilters = false;
	  });
  };

  // Clears selected terms for a given taxonomy filter object.
  $scope.resetTerms = function(object) {
  	angular.forEach(object, function(term, tid) {
  		term.selected = false;
  	});
  };

  // Clears the "More Options" filters.
  $scope.resetOptions = function() {
  	$scope.params.not_watched = false;
  	$scope.params.watched = false;
  	$scope.params.closed_captions = false;
  };

	// When a parameters value is changed, update the library results.
	$scope.$watch('params', function(newValue, oldValue) {
		if (newValue === oldValue) {
		  return;
		}

		$scope.updateResults();
  }, true);

	// Load initial results.
	$scope.updateResults();
}])

/**
 * Custom filter for returning selected taxonomy term filters as an array or,
 * optionally, as a delimited string.
 *
 * Syntax: <object> | selected:<delimter>
 */
.filter('selectedTerms', function() {
  return function(object, delimiter) {
    var terms = [];
    angular.forEach(object, function(term, tid) {
      if (term.selected) {
        terms.push(tid);
      }
    });

    return delimiter ? terms.join(delimiter) : terms;
  };
});
