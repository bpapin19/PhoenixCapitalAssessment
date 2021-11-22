const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema(
    {
        accountName: { type: String, unique: true },
        entityType: { type: String },
        ownerType: { type: String },
        address: { type: String, unique: true },
        numHoldings: { type: Number, default: 0 }
    }
);

module.exports = mongoose.model('account', accountSchema);