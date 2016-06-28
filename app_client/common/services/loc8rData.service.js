(function () {
    loc8rData.$inject = ['$http'];
    function loc8rData ($http) {
        var locationsByCoords = function (lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&distance=20');
        };

        var locationById = function(locationId) {
            return $http.get('/api/locations/' + locationId);
        };

        var addReviewById = function(locationId, data) {
            return $http.post('/api/locations/' + locationId + '/reviews', data);
        };

        return {
            locationsByCoords: locationsByCoords,
            locationById: locationById,
            addReviewById: addReviewById
        };
    }

    angular.module('loc8rApp').service('loc8rData', loc8rData);
})();
