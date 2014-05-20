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
          console.log(result);
        });
      };
    },
  };
}]);
