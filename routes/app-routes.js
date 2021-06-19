var express = require('express');
var router = express.Router();

const { employeeDetails, availabileFloors, bookSeat, resetMasterData } = require('../controllers/app-controller');

router.get('/employeeDetails', employeeDetails);
router.get('/availabileFloors', availabileFloors);
router.get('/resetMasterData', resetMasterData);
router.post('/bookSeat', bookSeat);

module.exports = router;