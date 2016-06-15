var mongoose = require('mongoose');

var Loc = mongoose.model('Location');

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    Loc.geoNear(point, {spherical: true}, function() {
        
    });
};

module.exports.locationsCreate = function (req, res) {
    sendResponse(res, 200, {"status": "success"});
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
    sendResponse(res, 200, {"status": "success"});
};

module.exports.locationsDeleteOne = function (req, res) {
    sendResponse(res, 200, {"status": "success"});
};

function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

