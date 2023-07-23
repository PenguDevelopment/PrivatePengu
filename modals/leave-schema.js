const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    leaveChannel: {
        type: String,
        required: true
    },
    leaveMessage: {
        type: String,
        required: true
    },
    leaveTitle: {
        type: String,
        required: true
    },
    leaveColor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Leave', leaveSchema);
