(function () {
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

    angular.module('loc8rApp').filter('formatDistance', formatDistance);
})();