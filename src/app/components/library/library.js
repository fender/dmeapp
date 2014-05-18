angular.module('dmeApp.library', [
  'dmeApp.api',
  'dmeApp.pager'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/videos', {
    templateUrl: 'library.html',
    controller: 'LibraryController',
    reloadOnSearch: false
  });
}])

.controller('LibraryController', ['$scope', '$location', 'selectedTermsFilter', 'Api', 'categoryTaxonomy', 'versionTaxonomy',
	function($scope, $location, selectedTermsFilter, Api, categoryTaxonomy, versionTaxonomy) {
  var search = $location.search();

  // Declare default filter parameters. Use the URL query if available.
	$scope.params = {
		categories: {},
		versions: {},
		not_watched: search.not_watched === 'true',
		watched: search.watched === 'true',
		closed_captions: search.closed_captions === 'true',
		sort: search.sort ? search.sort : 'created',
    page: search.page ? search.page : 1,
    pagesize: 15,
	};

  $scope.group_by_series = true;

	// Populate the taxonomy filters.
  // TODO move this to its own function and test RegExp further.
	angular.forEach(categoryTaxonomy, function(name, tid) {
    var selected = search.categories.match(tid + '(?=,|$)+') ? true : false;
		$scope.params.categories[tid] = {name: name, selected: selected};
	});
	angular.forEach(versionTaxonomy, function(name, tid) {
    var selected = search.versions.match(tid + '(?=,|$)+') ? true : false;
		$scope.params.versions[tid] = {name: name, selected: selected};
	});

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

  // This function is called every time we want to retrieve new media results.
  $scope.updateResults = function() {
    // Boolean used to temporarily disable filter interaction.
    $scope.loadingResults = true;

    // We make a copy of the parameters so as to not affect the scope.
    var params = angular.copy($scope.params);

    // Convert selected terms into a comma delimited string.
    params.categories = selectedTermsFilter(params.categories, ',');
    params.versions = selectedTermsFilter(params.versions, ',');

    // API requires a zero-based index for the pager.
    params.page -= 1;

    // Call our API for the new results.
    var resource = $scope.group_by_series ? 'Series' : 'Video';
    $scope.results = Api[resource].query(params, function() {
      $scope.loadingResults = false;
    });
  };

  // Listen for changes to our params object.
  $scope.$watch('params', function(newParams, oldParams) {
    if (newParams === oldParams) {
      return;
    }

    // Go back to the first page of results when non-sort filters are changed.
    if (newParams.page == oldParams.page && newParams.sort == oldParams.sort) {
      $scope.params.page = 1;
    }

    // Loop through parameter changes and update URL query as required.
    angular.forEach(newParams, function(param, key) {
      if (!angular.equals(param,oldParams[key])) {
        if (key == 'categories' || key == 'versions') {
          param = selectedTermsFilter(param, ',');
        }
        else if (typeof param == 'boolean') {
          // To show in the URL query we must cast true booleans to strings.
          param = param ? 'true' : null;
        }

        $location.search(key, param);
      }
    });

    $scope.updateResults();
  }, true);

	// Set initial results on page load.
	$scope.updateResults();
}])

/**
 * Custom filter for returning selected taxonomy term filters as an array or,
 * optionally, as a delimited string.
 *
 * Syntax: <object> | selectedTerms:<delimter>
 */
.filter('selectedTerms', function() {
  return function(object, delimiter) {
    var terms = [];
    angular.forEach(object, function(term, tid) {
      if (term.selected) {
        terms.push(tid);
      }
    });

    // Explicility return null if no terms are selected. This is to prevent an
    // empty string appearing in the URL query.
    if (!terms.length) {
      return null;
    }

    return delimiter ? terms.join(delimiter) : terms;
  };
});
