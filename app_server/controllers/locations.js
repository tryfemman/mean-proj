var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};

var renderHomepage = function (req, res, responseBody) {
    // var message;
    // if (!(responseBody instanceof Array)) {
    //     message = "API lookup error";
    //     responseBody = [];
    // } else if (!responseBody.length) {
    //     message = "No places found nearby";
    // }

    res.render('location-list', {
        title: 'Loc8r - Find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapLine: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. ' +
        'Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
        //locations: responseBody,
        //message: message
    });
};

module.exports.index = function (req, res) {
    // var path = "/api/locations";
    // var requestOptions = {
    //     url: apiOptions.server + path,
    //     method: "GET",
    //     json: {},
    //     qs: {
    //         lng: 9.12,
    //         lat: 9.12,
    //         distance: 20
    //     }
    // };
    //
    // request(
    //     requestOptions, function (err, response, body) {
    //         var i, data;
    //         data = body;
    //         if (response.statusCode === 200 && data.length) {
    //             for (i = 0; i < data.length; i++) {
    //                 data[i].distance = _formatDistance(data[i].distance);
    //             }
    //         }
            renderHomepage(req, res);
    //     }
    // );
};

var _formatDistance = function (distance) {
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
};

var _isNumeric = function(distance) {
    var isDistanceNan = isNaN(parseFloat(distance));
    var isDistanceFinite = isFinite(distance);
    return !isDistanceNan && isDistanceFinite;
};

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "/api/locations/" + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body) {
        if (response.statusCode === 200) {
            var data = body;
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showErrors(req, res, response.statusCode);
        }
    });
};

var _showErrors = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, Page not found";
        content = "Where did this page go? Oh well!";
    } else {
        title = status + ", something's gone wrong";
        content = "Looks like something went awfully wrong!";
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};

module.exports.locationInfo = function (req, res) {
    getLocationInfo(req, res, renderDetailsPage);
};

var renderDetailsPage = function (req, res, locationDetails) {
    res.render('location-info', {
        title: locationDetails.name,
        pageHeader: {
            title: locationDetails.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locationDetails
    })
};

module.exports.addReview = function (req, res) {
    getLocationInfo(req, res, renderReviewForm);
};

var renderReviewForm = function (req, res, locationDetails) {
    res.render('location-review-form', {
        title: 'Review ' + locationDetails.name + ' on Loc8r',
        pageHeader: {title: 'Review ' + locationDetails.name},
        error: req.query.err,
        url: req.originalUrl
    });
};

module.exports.doAddReview = function (req, res) {
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = "/api/locations/" + locationid + "/reviews";
    postdata = {
        author: req.body.name,
        rating: req.body.rating,
        reviewText: req.body.review
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    console.log(requestOptions);
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid);
            } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
                res.redirect('/location/' + locationid + '/reviews/new?err=val');
            } else {
                _showErrors(req, res, response.statusCode);
            }
        });
    }
};

