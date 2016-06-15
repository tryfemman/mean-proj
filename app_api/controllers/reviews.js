var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function(req, res) {
    sendResponse(res, 200, {"status": "success"});
};

module.exports.reviewsReadOne = function(req, res) {
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc.findById(req.params.locationid)
            .select('name reviews')
            .exec(
                function(err, location) {
                    var responseBody;
                    var review;
                    if (!location) {
                        sendResponse(res, 404, {
                            "message": "locationid not found"
                        });
                        return;
                    } else if (err) {
                        sendResponse(res, 404, err);
                        return;
                    }
                    if (location.reviews && location.reviews.length > 0) {
                        review = location.reviews.id(req.params.reviewid);
                        if (!review) {
                            sendResponse(res, 404, {
                                "message": "reviewid not found"
                            });
                        } else {
                            responseBody = {
                                location: {
                                    name: location.name,
                                    id: req.params.locationid
                                },
                                review: review
                            };
                            sendResponse(res, 200, responseBody);
                        }
                    } else {
                        sendResponse(res, 404, {
                            "message": "no reviews found"
                        });
                    }
                }
            )
    } else {
        sendResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
    }
};

module.exports.reviewsUpdateOne = function(req, res) {
    sendResponse(res, 200, {"status": "success"});
};

module.exports.reviewsDeleteOne = function(req, res) {
    sendResponse(res, 200, {"status": "success"});
};

function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

