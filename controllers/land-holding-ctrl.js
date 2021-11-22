const LandHolding = require('../models/land-holding-model');
require('dotenv').config();

createLandHolding = (req, res) => {

    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a land_holding',
        })
    }

    const land_holding = new LandHolding(body);

    if (!land_holding) {
        return res.status(400).json({ success: false, error: err });
    }

    land_holding
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: land_holding._id,
                message: land_holding.name + ' successfully added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Unable to add land_holding!',
            });
        });
};

getLandHoldings = async (req, res) => {
    await LandHolding.find({account: req.params.id}, (err, holdings) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!holdings.length) {
            return res
                .status(404)
                .json({ success: false, error: `Account not found` });
        }
        return res.status(200).json({ success: true, data: holdings });
    }).catch(err => console.log(err));
};

deleteLandHolding = async (req, res) => {
    await LandHolding.findOneAndDelete({ _id: req.params.id }, (err, land_holding) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!land_holding) {
            return res
                .status(404)
                .json({ success: false, error: `Holding not found` });
        }

        return res.status(200).json({ success: true, data: land_holding });
    }).catch(err => console.log(err));
};

deleteLandHoldingsWithAcctId = async (req, res) => {
    await LandHolding.deleteMany({ account: req.params.id }, (err, land_holding) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!land_holding) {
            return res
                .status(404)
                .json({ success: false, error: `Holding not found` });
        }

        return res.status(200).json({ success: true, data: land_holding });
    }).catch(err => console.log(err));
};

getLandHoldingById = async (req, res) => {
    await LandHolding.findOne({ _id: req.params.id }, (err, land_holding) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!land_holding) {
            return res
                .status(404)
                .json({ success: false, error: `Holding not found` });
        }
        return res.status(200).json({ success: true, data: land_holding });
    }).catch(err => console.log(err));
};

updateLandHolding = async (req, res) => {
    const body = req.body;

    console.log(body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    LandHolding.findOne({ _id: req.params.id }, (err, land_holding) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Account not found!',
            })
        }
        if (body.legalEntity) {
            land_holding.legalEntity = body.legalEntity;
        }
        if (body.netMineralAcres) {
            land_holding.netMineralAcres = body.netMineralAcres;
        }
        if (body.mineralOwnerRoyalty) {
            land_holding.mineralOwnerRoyalty = body.mineralOwnerRoyalty;
        }
        if (body.section) {
            land_holding.section = body.section;
        }
        if (body.township) {
            land_holding.township = body.township;
        }
        if (body.range) {
            land_holding.range = body.range;
        }
        if (body.titleSource) {
            land_holding.titleSource = body.titleSource;
        }
        
        land_holding
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: land_holding._id,
                    message: 'Account updated!',
                });
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Account not updated!',
                });
            });
    });
};

 module.exports = {
    createLandHolding,
    getLandHoldings,
    deleteLandHolding,
    updateLandHolding,
    getLandHoldingById,
    deleteLandHoldingsWithAcctId
}