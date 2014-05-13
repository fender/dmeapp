angular.module('dmeApp.video', [])

.factory('VideoService', ['Api', function(Api) {
	var VideoService = {};

	VideoService.query = function(params, success) {
		Api.Video.query(params, function(data) {
			success(data);
		});
	};

	VideoService.addToQueue = function(id) {

	};

	VideoService.removeFromQueue = function(id) {

	};

	return VideoService;
}]);

// TODO add directive for Video grid and list types