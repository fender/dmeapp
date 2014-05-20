angular.module('dmeApp.library', [
  'dmeApp.api',
  'dmeApp.pager',
  'dmeApp.playlist',
  'dmeApp.queue'
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

  // Debug code. TODO remove
  $scope.mediaFormat = 'list';

  // Declare default filter params using the URL query if available.
  var search = $location.search();
	$scope.params = {
    group_by_series: search.group_by_series ? search.group_by_series === 'true' : true,
		not_watched: search.not_watched === 'true',
		watched: search.watched === 'true',
		closed_captions: search.closed_captions === 'true',
		sort: search.sort ? search.sort : 'created',
    page: search.page ? parseInt(search.page) : 1,
    pagesize: 15,
	};

  // Populates a filter param with given taxonomy.
  var populateTerms = function(param, taxonomy) {
    $scope.params[param] = {};
    angular.forEach(taxonomy, function(name, tid) {
      var regexp = new RegExp(tid + '(?=,|$)+'); // Checks for tid in URL query.
      $scope.params[param][tid] = {name: name, selected: regexp.test(search[param])};
    });
  };

  populateTerms('categories', categoryTaxonomy);
  populateTerms('versions', versionTaxonomy);

  // Clears selected terms for a given taxonomy filter parameter.
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

    // Convert selected terms into comma delimited strings.
    params.categories = selectedTermsFilter(params.categories, ',');
    params.versions = selectedTermsFilter(params.versions, ',');

    // API requires a zero-based index for the pager.
    params.page -= 1;

    // Call required API resource for the new results.
    var resource = $scope.params.group_by_series ? 'Series' : 'Video';
    Api[resource].query(params, function(results) {
      $scope.results = results;
      $scope.loadingResults = false;
    });
  };

  $scope.firstResult = function() {
    return $scope.params.page == 1 ? 1 : (($scope.params.page - 1) * $scope.params.pagesize) + 1;
  };

  $scope.lastResult = function() {
    return $scope.params.page == $scope.results.pager_total ? $scope.results.pager_total_items : $scope.params.page * $scope.params.pagesize;
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
          if (!param && key != 'group_by_series') {
            // Setting params to null clears them from the URL query.
            param = null;
          }
          else {
            // To place in the URL query we must cast booleans to strings.
            param = param.toString();
          }
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
