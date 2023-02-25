const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    roles: [],
    boost:[]
});

module.exports = mongoose.model('alert', schema, 'alert');
