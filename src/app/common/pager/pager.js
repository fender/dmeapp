/**
 * Defines a dme-pager directive.
 */

angular.module('dmeApp.pager', [])

.directive('dmePager', function() {
  return {
  	restrict: 'E',
  	scope: {
  		currentPage: '=currentPage',
  		pageSize: '=pageSize',
  		totalPages: '=totalPages',
  		totalItems: '=totalItems',
  	},
    templateUrl: 'dme-pager.html',
    link: function($scope, element, attrs) {
    	$scope.firstResult = function() {
    		return $scope.currentPage == 1 ? 1 : (($scope.currentPage - 1) * $scope.pageSize) + 1;
    	};

    	$scope.lastResult = function() {
    		return $scope.currentPage == $scope.totalPages ? $scope.totalItems : $scope.currentPage * $scope.pageSize;
    	};
    },
  };
});
