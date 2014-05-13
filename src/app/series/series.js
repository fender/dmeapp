angular.module('dmeApp.series', [])

.factory('SeriesService', ['Api', function(Api) {
	var SeriesService = {};

	SeriesService.query = function(params, success) {
		var data = Api.Series.query(params, function() {
			success(data);
		});
	};

	SeriesService.addToQueue = function(id) {

	};

	SeriesService.removeFromQueue = function(id) {

	};

	return SeriesService;
}]);

// TODO add directive for Video grid and list types