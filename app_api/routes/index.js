var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuthentication = require('../controllers/authentication');

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', auth, ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', auth, ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', auth, ctrlLocations.locationsDeleteOne);

router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsDeleteOne);

router.post('/register', ctrlAuthentication.register);
router.post('/login', ctrlAuthentication.login);

module.exports = router;