var express = require('express');
var router = express.Router();

var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

router.get('/', ctrlLocations.index );
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/reviews/new', ctrlLocations.addReview);
router.post('/location/:locationid/reviews/new', ctrlLocations.doAddReview);
router.get('/about', ctrlOthers.about);

module.exports = router;
