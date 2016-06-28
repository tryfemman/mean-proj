(function () {
    loc8rData.$inject = ['$http'];
    function loc8rData ($http) {
        var locationsByCoords = function (lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&distance=20');
        };
        return {
            locationsByCoords: locationsByCoords
        };
    }

    angular.module('loc8rApp').service('loc8rData', loc8rData);
})();
