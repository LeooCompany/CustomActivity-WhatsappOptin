const express = require('express')
const baseController = require('./controllers/baseController');

const router = express.Router()

router.post('/api/execute',baseController.executionData);
router.post('/api/save',baseController.getValidate);
router.post('/api/validate',baseController.getSave);
router.post('/api/publish',baseController.getPublish);
router.post('/api/stop',baseController.getStop);


module.exports = router;