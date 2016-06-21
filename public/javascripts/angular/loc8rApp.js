var geolocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    };
};

var loc8rData = function ($http) {
    var locationByCoords = function(lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&distance=20');
    };
    return {
        locationByCoords: locationByCoords
    };
};

var locationListCtrl = function ($scope, loc8rData, geolocation) {
    $scope.message = "Checking your location";

    $scope.getData = function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.message = "Searching for nearby places";
        loc8rData.locationByCoords(lat, lng).success(function (data) {
            $scope.message = data.length > 0 ? "" : "No locations found";
            $scope.data = {locations: data}
        }).error(function (e) {
            $scope.message = "Sorry, something's gone wrong ";
            console.log(e);
        });
    };

    $scope.showError = function (error) {
        $scope.$apply(function () {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function () {
        $scope.$apply(function () {
            $scope.message = "Geolocation is not supported by this browser.";
        });
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

var formatDistance = function () {
    return function (distance) {
        var isDistanceNan = isNaN(distance);
        var isDistanceFinite = isFinite(distance);
        if (distance && _isNumeric(distance)) {
            var numDistance, unit;
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return '?';
        }
    }
};

var _isNumeric = function (distance) {
    var isDistanceNan = isNaN(parseFloat(distance));
    var isDistanceFinite = isFinite(distance);
    return !isDistanceNan && isDistanceFinite;
};

var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/javascripts/angular/rating-stars.html'
    };
};

angular
    .module('loc8rApp', [])
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geolocation', geolocation);