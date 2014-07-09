/*! 
* dmeapp - v0.0.0
* Copyright (c) 2014  
* http://drupalize.me 
*/ 

(function ( window, angular, undefined ) {

/**
 * This file/module contains user configurations.
 */

var api_path = 'http://drupalize.me/api/v1';

/**
 * This file/module contains user configurations.
 */

var api_path = 'http://local.drupalize.me:8082/api/v1';

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

.controller('NavController', ['$scope', '$location', function($scope, $location) {
  $scope.linkIsActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
}]);

/**
 * In this module we define API functionality for the Drupalize.Me API.
 */

angular.module('dmeApp.api', ['ngResource'])

.config(['$httpProvider', function($httpProvider) {
	// This CSRF token is not required in Services 3.3. We shouldn't upgrade to
 	// services 3.5 until a full decoupled repository is in place.
  // $httpProvider.defaults.headers.common['X-CSRF-Token'] = '';
}])

.factory('Api', ['$resource', function($resource) {
	var Api = {
		Connect: $resource(api_path + '/system/connect'),
		Flag: $resource(api_path + '/flag/flag'),
  	Series: $resource(api_path + '/series/:id', {id: '@id'}, {'query': {method: 'GET', isArray: false}}),
    Video: $resource(api_path + '/video/:id', {id: '@id'}, {'query': {method: 'GET', isArray: false}}),
	};

  return Api;
}]);


/**
 * Defines a dme-pager directive.
 */

angular.module('dmeApp.pager', [])

.directive('dmePager', function() {
  return {
  	restrict: 'E',
  	scope: {
  		currentPage: '=currentPage',
  		totalPages: '=totalPages'
  	},
    templateUrl: 'dme-pager.html',
    link: function($scope, element, attrs) {
      $scope.$watch('currentPage', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
    },
  };
});

/**
 * Defines a dme-playlist directive.
 */

angular.module('dmeApp.playlist', [])

.directive('dmePlaylist', ['Api', function(Api) {
  return {
  	restrict: 'E',
  	scope: {
  		playlistId: '=playlistId',
      headerText: '=headerText',
    },
    templateUrl: 'dme-playlist.html',
    link: function(scope) {
      scope.loadingResults = true;
      scope.results = Api.Video.query({series: scope.playlistId}, function() {
        scope.loadingResults = false;
      });
    },
  };
}]);

/**
 * Defines a dme-queue directive.
 */

angular.module('dmeApp.queue', [])

.directive('dmeQueue', ['Api', function(Api) {
  return {
  	restrict: 'E',
  	scope: {
  		nodeId: '=nodeId',
      inQueue: '=inQueue',
  	},
    templateUrl: 'dme-queue.html',
    link: function(scope) {
      scope.toggleQueue = function() {
        var params = {
          flag_name: 'queue',
          content_id: scope.nodeId,
          action: scope.inQueue ? 'unflag' : 'flag',
          uid: 6807
        };

        var result = Api.Flag.save(params, function() {
          // TODO implement queue functionality.
          console.log(result);
        });
      };
    },
  };
}]);

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

  $scope.results = {};

  // Populates a filter param with given taxonomy.
  var populateTerms = function(param, taxonomy) {
    $scope.params[param] = {};
    angular.forEach(taxonomy, function(name, tid) {
      var regexp = new RegExp(tid + '(?=,|$)+'); // Checks for tid in URL query.
      $scope.params[param][tid] = {name: name, selected: regexp.test(search[param])};
    });
  };

  // Clears selected terms for a given taxonomy filter parameter.
  $scope.resetTerms = function(object) {
  	angular.forEach(object, function(term, tid) {
  		term.selected = false;
  	});
  };

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

  // Returns the first result index shown on the current page.
  $scope.firstResult = function() {
    return $scope.params.page == 1 ? 1 : (($scope.params.page - 1) * $scope.params.pagesize) + 1;
  };

  // Returns the last result index shown on the current page.
  $scope.lastResult = function() {
    return $scope.params.page == $scope.results.pager_total ? $scope.results.pager_total_items : $scope.params.page * $scope.params.pagesize;
  };

  $scope.showLibraryBanner = function() {
    return !localStorage.getItem('hideLibraryBanner');
  };

  $scope.closeLibraryBanner = function() {
    localStorage.setItem('hideLibraryBanner', true);
  };

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

  populateTerms('categories', categoryTaxonomy);
  populateTerms('versions', versionTaxonomy);

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

angular.module('dmeApp.series', [])

.factory('SeriesService', ['Api', function(Api) {
	// TODO do we need a factory for series?
	return {};
}]);

angular.module('dmeApp.user', [])

.run(['$rootScope', 'Api', function($rootScope, Api) {
	$rootScope.user = {};

	Api.Connect.save(null, function(data) {
		if (angular.isDefined(data.user)) {
			$rootScope.user.uid = data.user.uid;
			$rootScope.user.loggedIn = $rootScope.user.uid > 0;
		}
	}, function() {
		$rootScope.user.loggedIn = false;
	});
}])

.factory('UserService', ['Api', function(Api) {
	// TODO don't use the $rootScope above but move this to UserService?
	return {};
}]);

angular.module('dmeApp.video', [])

.factory('VideoService', ['Api', function(Api) {
	// TODO do we need a factory for video?
	return {};
}]);

angular.module('dmeApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('dme-pager.html',
    "<div class=\"pager\"><a href=\"\" ng-click=\"currentPage = currentPage - 1\" ng-show=\"currentPage > 1\"><span class=\"pager__arrow\">&#9664;</span></a> <a href=\"\" ng-click=\"currentPage = 1\" ng-show=\"currentPage > 1\">1</a> <a href=\"\" ng-click=\"currentPage = 2\" ng-show=\"currentPage > 2\">2</a> <span ng-show=\"currentPage > 5\">...</span> <a href=\"\" ng-click=\"currentPage = currentPage - 2\" ng-show=\"currentPage > 4\">{{currentPage - 2}}</a> <a href=\"\" ng-click=\"currentPage = currentPage - 1\" ng-show=\"currentPage > 3\">{{currentPage - 1}}</a> <span>{{currentPage}}</span> <a href=\"\" ng-click=\"currentPage = currentPage + 1\" ng-show=\"currentPage <= totalPages - 3\">{{currentPage + 1}}</a> <a href=\"\" ng-click=\"currentPage = currentPage + 2\" ng-show=\"currentPage <= totalPages - 4\">{{currentPage + 2}}</a> <span ng-show=\"currentPage + 4 < totalPages\">...</span> <a href=\"\" ng-click=\"currentPage = totalPages - 1\" ng-show=\"currentPage < totalPages - 1\">{{totalPages - 1}}</a> <a href=\"\" ng-click=\"currentPage = totalPages\" ng-show=\"currentPage < totalPages\">{{totalPages}}</a> <a href=\"\" ng-click=\"currentPage = currentPage + 1\" ng-show=\"currentPage < totalPages\"><span class=\"pager__arrow\">&#9654;</span></a></div>"
  );


  $templateCache.put('dme-playlist.html',
    "<div class=\"playlist__header\" ng-show=\"headerText\">{{headerText}}</div><div class=\"playlist__content\"><div class=\"playlist__loading\" ng-show=\"loadingResults\"><span>Loading...</span></div><ul class=\"playlist\"><li class=\"playlist__item\" ng-repeat=\"item in results.items\"><a class=\"playlist__item__link\" ng-href=\"{{item.coming_soon ? null : item.url}}\" target=\"_self\"><span class=\"playlist__item__count\">{{$index + 1}}</span> <span class=\"playlist__item__title\">{{item.title}}</span> <span class=\"coming-soon\" ng-show=\"item.coming_soon\">Coming Soon</span><div class=\"playlist__item__meta\"><span class=\"free\" ng-show=\"item.is_free\">FREE</span> <span class=\"watched\" ng-show=\"item.watched\">{{item.watched_percent}}% watched</span> <span class=\"playlist__item__progress\"></span></div><span class=\"playlist__item__duration\">{{item.total_time}}</span></a></li></ul></div>"
  );


  $templateCache.put('dme-queue.html',
    "<a href=\"\" class=\"queue-link dme-font-{{inQueue ? 'check' : 'plus'}} font--inline\" ng-click=\"toggleQueue()\">Queue</a>"
  );


  $templateCache.put('front.html',
    "<div class=\"l-container\"><div class=\"l-content\"><h1>Front page placeholder</h1><p>This page is a placeholder for what will eventually become the front page. You'll notice most of the links on this page do not work yet as we build up the application. In the meantime, check out the <a href=\"/styleguide\">Style Guide</a> to see the components that have been implement so far.</p></div></div>"
  );


  $templateCache.put('library.html',
    "<div class=\"banner banner--top banner--blue banner--library\" ng-show=\"showLibraryBanner()\"><div class=\"l-container\"><h1>Library</h1><p>Containing over 800 Drupal training videos, our library provides more Drupal content than anyone, anywhere. Find out why our users have racked up thousands of hours watching our premium Drupal training videos. Easy to follow learning paths are available, <a href=\"\">try our guides</a>.</p><a href=\"\" class=\"banner__close dme-font-cross\" ng-click=\"closeLibraryBanner()\"></a></div></div><div class=\"loading\" ng-show=\"loadingResults\"></div><div class=\"l-container l-container--sidebar\" ng-class=\"{'is-loading-content': loadingResults}\"><div class=\"l-sidebar\"><div class=\"block panel panel--padded l-show-mobile\"><a href=\"\" ng-click=\"showFilters = !showFilters\">Filters</a></div><div class=\"block panel\" ng-class=\"{'l-hide-mobile': showFilters == undefined || !showFilters}\"><h5 class=\"library__filters__header dme-font-folder font--inline\">Categories <a href=\"\" class=\"library__filters__clear l-float-right\" ng-click=\"resetTerms(params.categories)\" ng-show=\"!loadingResults && (params.categories | selectedTerms).length\">Clear</a></h5><div class=\"library__filters\"><div ng-repeat=\"(tid,category) in params.categories\" class=\"library__filters__filter\"><input type=\"checkbox\" id=\"category-{{tid}}\" ng-model=\"category.selected\" ng-disabled=\"loadingResults\"><label class=\"font--inline\" for=\"category-{{tid}}\">{{category.name}}</label></div></div><h5 class=\"library__filters__header dme-font-dme font--inline\">Versions <a href=\"\" class=\"library__filters__clear l-float-right\" ng-click=\"resetTerms(params.versions)\" ng-show=\"!loadingResults && (params.versions | selectedTerms).length\">Clear</a></h5><div class=\"library__filters\"><div ng-repeat=\"(tid,version) in params.versions\" class=\"library__filters__filter\"><input type=\"checkbox\" id=\"version-{{tid}}\" ng-model=\"version.selected\" ng-disabled=\"loadingResults\"><label class=\"font--inline\" for=\"version-{{tid}}\">{{version.name}}</label></div></div><h5 class=\"library__filters__header dme-font-plus-alternative font--inline\">More Options <a href=\"\" class=\"library__filters__clear l-float-right\" ng-click=\"resetOptions()\" ng-show=\"!loadingResults && (params.not_watched || params.watched || params.closed_captions)\">Clear</a></h5><div class=\"library__filters\"><div class=\"library__filters__filter\"><input type=\"checkbox\" id=\"watched\" ng-model=\"params.not_watched\" ng-disabled=\"loadingResults\"><label class=\"font--inline\" for=\"watched\">Not Watched</label></div><div class=\"library__filters__filter\"><input type=\"checkbox\" id=\"not-watched\" ng-model=\"params.watched\" ng-disabled=\"loadingResults\"><label class=\"font--inline\" for=\"not-watched\">Watched</label></div><div class=\"library__filters__filter\"><input type=\"checkbox\" id=\"closed-captions\" ng-model=\"params.closed_captions\" ng-disabled=\"loadingResults\"><label class=\"font--inline\" for=\"closed-captions\">Closed Captions</label></div></div></div><div class=\"library__guides block panel panel--padded l-hide-mobile\"><h4>Guides</h4><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.</p><a class=\"button button--primary\">Explore Guides</a></div></div><div class=\"l-content l-content--library\"><div class=\"panel panel--library\"><div class=\"panel__header\"><div class=\"l-float-left\" ng-show=\"results.items\"><span class=\"l-hide-mobile\">Showing</span> {{firstResult()}} - {{lastResult()}} of {{results.pager_total_items}} series</div><div class=\"l-float-right\"><label>Sort by</label><select ng-model=\"params.sort\"><option value=\"created\">Release date</option><option value=\"title\">Title</option></select></div><!-- <div class=\"right\">\n" +
    "          <label class=\"library-filter\">\n" +
    "              <input type=\"checkbox\" ng-model=\"params.group_by_series\">Group by Series\n" +
    "          </label>\n" +
    "        </div> --></div><div class=\"library__status\" ng-show=\"!loadingResults && !results.items\">No results found.</div><div class=\"media__list\" ng-show=\"results.items\"><div class=\"media\" ng-repeat=\"item in results.items\"><a class=\"media__object\" href=\"{{item.url}}\" target=\"_self\"><img ng-src=\"{{item.screenshot}}\"> <i class=\"dme-font-play font--box\"></i><div class=\"media__object__labels\"><i class=\"dme-font-hd font--box\" ng-if=\"item.hd\"></i> <i class=\"dme-font-cc font--box\" ng-if=\"item.cc\"></i></div></a><div class=\"media__body\"><h4 class=\"media__title\"><a href=\"{{item.url}}\" target=\"_self\">{{item.title}}</a></h4><div class=\"media__subtitle\"><span ng-repeat=\"tid in item.categories\">{{params.categories[tid].name}}{{!$last || $last && item.versions ? ', ' : ''}}</span> <span ng-repeat=\"tid in item.versions\">{{params.versions[tid].name}}{{!$last ? ', ' : ''}}</span></div><p class=\"media__description\">{{item.description | limitTo: 120}}{{item.description.length > 120 ? '...' : ''}}</p><ul class=\"media__links\"><li><a href=\"\" class=\"dme-font-arrow-{{showPlaylist ? 'up' : 'down'}} font--inline\" ng-click=\"showPlaylist = showPlaylist ? false : true\">{{item.videos.length}} videos</a> <em class=\"media__watched-count\" ng-show=\"item.watched_count\">({{item.watched_count}} watched)</em></li><li><dme-queue node-id=\"item.nid\" in-queue=\"item.queued\"></dme-queue></li></ul></div><div ng-if=\"showPlaylist != undefined\"><dme-playlist playlist-id=\"item.nid\" ng-show=\"showPlaylist\" class=\"playlist--dark\"></dme-playlist></div></div></div></div><dme-pager current-page=\"params.page\" total-pages=\"results.pager_total\" ng-show=\"results.items\"></dme-pager></div></div>"
  );


  $templateCache.put('styleguide.html',
    "<div class=\"container\"><h1>Style guide</h1><p>Welcome! This page is a reference for internal Drupalize.Me developers and is not for public consumption. You'll find all of the different components that make up our pages kick ass demonstrated below!</p><p><strong>Note:</strong> This page is a work in progress and we're only adding new components when we actually implement them into the app.</p><hr><h3 id=\"type\">Headers</h3><h1>h1. This is a very large header.</h1><h2>h2. This is a large header.</h2><h3>h3. This is a medium header.</h3><h4>h4. This is a moderate header.</h4><h5>h5. This is a small header.</h5><h6>h6. This is a tiny header.</h6><hr><h3 id=\"lists\">Lists</h3><h5>Inline lists are great for menus</h5><ul class=\"listInline\"><li><a href=\"#\">Link 1</a></li><li><a href=\"#\">Link 2</a></li><li><a href=\"#\">Link 3</a></li><li><a href=\"#\">Link 4</a></li><li><a href=\"#\">Link 5</a></li></ul><h5>Un-ordered lists are great for making quick outlines bulleted.</h5><ul class=\"disc\"><li>List item with a much longer description or more content.</li><li>List item</li><li>List item<ul><li>Nested List Item</li><li>Nested List Item</li><li>Nested List Item</li></ul></li><li>List item</li><li>List item</li><li>List item</li></ul><h5>Ordered lists are great for lists that need order, duh.</h5><ol><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ol><hr><h3 id=\"blockquote\">Blockquote<blockquote>I do not fear computers. I fear the lack of them. Maecenas faucibus mollis interdum. Aenean lacinia bibendum nulla sed consectetur.<cite>Isaac Asimov</cite></blockquote><hr><h3 id=\"panel\">Panel</h3><div style=\"background: #f5f5f5;padding:1.5em\"><div class=\"panel panel--padded\">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</div></div></h3></div>"
  );

}]);

})( window, window.angular );
