const express = require('express');
const dataControllers = require('../controllers/data-controllers');
const router = express.Router();


// Strava API
//router.get('/strava_api/getXXXX/', dataControllers.getActivities);

router.get('/getactivities', dataControllers.getActivities);
router.get('/getstravaactivities', dataControllers.getStravaActivities);
router.get('/getstravagpsdatata', dataControllers.getStravaGPSData);

/*
router.get('/', dataControllers.getMyData);

router.get('/results/amateurs/', dataControllers.getSummaryData);

router.get('/results/professionals/', dataControllers.getSummaryData);

router.post('/', dataControllers.addItem);

router.delete('/:id', dataControllers.deleteItem);

router.put('/:id', dataControllers.updateItem);
*/

module.exports = router;