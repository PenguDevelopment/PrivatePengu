const mongoose = require('mongoose');

// create schema for a verify button system

const schema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    specificId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('verify', schema, 'verify');