var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');

var actUponSpecificLocation = function (req, res, locationAction, userName) {
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
                locationAction(req, res, location, userName);
            });
    } else {
        sendResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
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

function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}


var getAuthor = function (req, res, callback) {
    if (req.payload && req.payload.email) {
        User.findOne({email: req.payload.email})
            .exec(function (err, user) {
                if (!user) {
                    sendResponse(res, 404, {
                        "message": "User not found"
                    });
                } else if (err) {
                    console.log(err);
                    sendResponse(res, 404, err);
                } else {
                    callback(req, res, user.name);
                }
            });
    }
};

module.exports.reviewsCreate = function (req, res) {
    getAuthor(req, res, function (req, res, userName) {
        actUponSpecificLocation(req, res, doAddReview, userName);
    });
};

var doAddReview = function (req, res, location, author) {
    location.reviews.push({
        author: author,
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

module.exports.reviewsReadOne = function (req, res) {
    actUponSpecificLocation(req, res, doReadReview);
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


module.exports.reviewsUpdateOne = function (req, res) {
    actUponSpecificLocation(req, res, doUpdateReview);
};

var doUpdateReview = function (req, res, location) {
    var thisReview;
    if (req.params.reviewid) {
        if (location.reviews && location.reviews.length > 0) {
            thisReview = location.reviews.id(req.params.reviewid);
            if (thisReview) {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;

                location.save(function (err, location) {
                    if (err) {
                        sendResponse(res, 400, err);
                    } else {
                        updateAverageRating(location);
                        sendResponse(res, 200, thisReview);
                    }
                });
            } else {
                sendResponse(res, 404, {
                    "message": "reviewid not found"
                });
            }
        } else {
            sendResponse(res, 404, {
                "message": "No review to update"
            });
        }
    } else {
        sendResponse(res, 404, {
            "message": "Not found, reviewid is required"
        });
    }
};

module.exports.reviewsDeleteOne = function (req, res) {
    actUponSpecificLocation(req, res, doDeleteReview);
};

var doDeleteReview = function (req, res, location) {
    if (req.params.reviewid) {
        if (location && location.reviews && location.reviews.length > 0) {
            if (!location.reviews.id(req.params.reviewid)) {
                sendResponse(res, 404, {
                    "message": "reviewid not found"
                });
            } else {
                location.reviews.id(req.param.reviewid).remove();
                location.save(function (err, location) {
                    if (err) {
                        sendResponse(res, 404, err);
                    } else {
                        updateAverageRating(location);
                        sendResponse(res, 204, null);
                    }
                });
            }
        } else {
            sendResponse(res, 404, {
                "message": "No review to delete"
            });
        }
    } else {
        sendResponse(res, 404, {
            "message": "Not found, reviewid is required"
        });
    }
};

