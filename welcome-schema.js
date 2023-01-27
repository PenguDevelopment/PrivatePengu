const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const welcomeSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    welcomeChannel: {
        type: String,
        required: true
    },
    welcomeTitle: {
        type: String,
        required: true
    },
    welcomeColor: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String,
        required: true
    },
    outsideMention: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Welcome', welcomeSchema);
