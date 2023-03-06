const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    roles: [],
    boosts:[]
});

module.exports = mongoose.model('alert', schema, 'alert');
