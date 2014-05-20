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
