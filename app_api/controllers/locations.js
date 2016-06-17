var mongoose = require('mongoose');

var Loc = mongoose.model('Location');

var theEarth = (function () {
    var earthRadius = 6371;

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    }
})();

var translateGeoResults = function (geoResults) {
    var locations = [];
    geoResults.forEach(function (doc) {
        locations.push({
            distance: theEarth.getDistanceFromRads(doc.dis),
            name: doc.obj.name,
            address: doc.obj.address,
            rating: doc.obj.rating,
            facilities: doc.obj.facilities,
            _id: doc.obj._id
        });
    });
    return locations;
};

module.exports.locationsListByDistance = function (req, res) {
    if (!req.query || !req.query.lng || !req.query.lat || !req.query.distance) {
        sendResponse(res, 404, {
            "message": "lng, lat and distance query parameters are all required"
        });
        return;
    }
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseInt(req.query.distance);
    var nearPoint = [lng, lat];
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        limit: 10
    };
    Loc.geoNear(nearPoint, geoOptions, function (err, results, stats) {
        if (err) {
            sendResponse(res, 404, err);
        } else {
            sendResponse(res, 200, translateGeoResults(results));
        }
    });
};

module.exports.locationsCreate = function (req, res) {
    var newLocationObj = getLocationObjFromRequest(req);
    Loc.create(newLocationObj, function (err, location) {
        if (err) {
            sendResponse(res, 400, err);
        } else {
            sendResponse(res, 201, location);
        }
    });
};

var getLocationObjFromRequest = function (req) {
    var locationObj = {};
    locationObj.name = req.body.name;
    locationObj.address = req.body.address;
    locationObj.facilities = req.body.facilities.split(",");
    locationObj.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
    locationObj.openingTimes = [];
    var count = 1;
    while (req.body["days" + count] && req.body["closed" + count]) {
        locationObj.openingTimes.push({
            days: req.body["days" + count],
            opening: req.body["opening" + count],
            closing: req.body["closing" + count],
            closed: req.body["closed" + count]
        });
        count = count + 1;
    }
    return locationObj;
};

module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Loc.findById(req.params.locationid).exec(function (err, location) {
            if (!location) {
                sendResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                sendResponse(res, 404, err)
                return;
            }
            sendResponse(res, 200, location);
        });
    } else {
        sendResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsUpdateOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Loc.findById(req.params.locationid)
            .select('-reviews -rating')
            .exec(function (err, location) {
                if (!location) {
                    sendResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendResponse(res, 404, err)
                    return;
                }
                var updatedLocationObj = getLocationObjFromRequest(req);
                location.name = updatedLocationObj.name;
                location.address = updatedLocationObj.address;
                location.facilities = updatedLocationObj.facilities.split(",");
                location.coords = updatedLocationObj.coords;
                location.openingTimes = updatedLocationObj.openingTimes;
                location.save(function(err, location) {
                    if (err) {
                        sendResponse(res, 404, err);
                    } else {
                        sendResponse(res, 200, location);
                    }
                });
            });
    } else {
        sendResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsDeleteOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Loc.findByIdAndRemove(req.params.locationid)
            .exec(function(err, location) {
                if (err) {
                    sendResponse(res, 404, err);
                } else {
                    sendResponse(res, 204, null);
                }
            });
    } else {
        sendResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
};

function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

