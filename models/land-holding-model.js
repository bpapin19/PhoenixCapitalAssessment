const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landHoldingSchema = new Schema(
    {
        name: { type: String },
        account: {type: String},
        legalEntity: { type: String },
        netMineralAcres: { type: Number },
        mineralOwnerRoyalty: { type: Number },
        sectionName: { type: String },
        section: { type: String },
        township: { type: String },
        range: { type: String },
        titleSource: { type: String }
    }
);

module.exports = mongoose.model('land-holding', landHoldingSchema);