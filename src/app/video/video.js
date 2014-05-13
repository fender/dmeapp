angular.module('dmeApp.video', [])

.factory('VideoService', ['Api', function(Api) {
	// get, query
	var VideoService = {};

	VideoService.query = function(params) {
		// TODO this doesn't work
		params.type = 'video';

		Api.Nodes.query(params, function(data) {
			// format results

			return data;
		});
	};

	VideoService.addToQueue = function(id) {

	};

	VideoService.removeFromQueue = function(id) {

	};

	return VideoService;
}]);

// TODO add directive for Video grid and list types