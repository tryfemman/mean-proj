var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
    actUponSpecificLocation(req, res, doAddReview);
};

var actUponSpecificLocation = function (req, res, locationAction) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc.findById(locationid)
            .select('_id name reviews')
            .exec(function (err, location) {
                if (!location) {
                    sendResponse(res, 400, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendResponse(res, 400, err);
                    return;
                }
                locationAction(req, res, location);
            });
    } else {
        sendResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
};

var doAddReview = function (req, res, location) {
    location.reviews.push({
        author: req.body.author,
        rating: req.body.rating,
        reviewText: req.body.reviewText
    });
    location.save(function (err, location) {
        var thisPreview;
        if (err) {
            sendResponse(res, 400, err);
        } else {
            updateAverageRating(location);
            thisPreview = location.reviews[location.reviews.length - 1];
            sendResponse(res, 201, thisPreview);
        }
    });
};

var updateAverageRating = function (location) {
    var reviews = location.reviews;
    var i, reviewCount, ratingAverage, ratingTotal;
    if (reviews && reviews.length > 0) {
        reviewCount = reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function (err, location) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to ", ratingAverage);
            }
        });
    }
};

var doReadReview = function (req, res, location) {
    var responseBody;
    var review;
    if (!req.params.reviewid) {
        sendResponse(res, 404, {
            "message": "Not found, reviewid is required"
        });
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
};

module.exports.reviewsReadOne = function (req, res) {
    actUponSpecificLocation(req, res, doReadReview);
};


module.exports.reviewsUpdateOne = function (req, res) {
    sendResponse(res, 200, {"status": "success"});
};

module.exports.reviewsDeleteOne = function (req, res) {
    sendResponse(res, 200, {"status": "success"});
};

function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

