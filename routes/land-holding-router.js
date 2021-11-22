const express = require('express');

const LandHoldingCtrl = require('../controllers/land-holding-ctrl');

const router = express.Router();

router.post('/land-holding', LandHoldingCtrl.createLandHolding);
router.get('/land-holdings/:id', LandHoldingCtrl.getLandHoldings);
router.get('/land-holding/:id', LandHoldingCtrl.getLandHoldingById);
router.put('/land-holding/:id', LandHoldingCtrl.updateLandHolding);
router.delete('/land-holding/:id', LandHoldingCtrl.deleteLandHolding);
router.delete('/land-holdings/:id', LandHoldingCtrl.deleteLandHoldingsWithAcctId);


module.exports = router;