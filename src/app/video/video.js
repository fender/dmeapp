angular.module('dmeApp.video', [])

.factory('VideoService', ['Api', function(Api) {
	// get, query
	var VideoService = {};

	VideoService.query = function(params) {
		Api.Videos.query(params, function() {
			// format results
		});
	};

	VideoService.addToQueue = function(id) {

	};

	VideoService.removeFromQueue = function(id) {

	};

	return VideoService;
}]);

// TODO add directive for Video grid and list types