const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildID: {
        type: String,
        required: false
    },
    channelID: {
        type: String,
        required: false
    },
    acceptChannel: {
        type: String,
        required: false
    },
    reportChannel: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('guild', schema, 'guild');