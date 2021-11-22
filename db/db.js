const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@phoenixcapitalcluster.kshag.mongodb.net/PhoenixCapital?retryWrites=true&w=majority`;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message);
    })

const db = mongoose.connection;

db.once('open', function() {
    console.log("Connected!");
});

module.exports = db;