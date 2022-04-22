const express = require('express');
const dataControllers = require('../controllers/data-controllers');
const router = express.Router();

router.get('/getactivities', dataControllers.getActivities);
router.get('/getstravaactivities', dataControllers.getStravaActivities);

module.exports = router;