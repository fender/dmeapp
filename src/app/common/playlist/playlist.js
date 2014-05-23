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
        console.log(scope.results);
      });
    },
  };
}]);
