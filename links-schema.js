const mongoose = require('mongoose');

const linksSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true,
    },
    links: {
        type: Array,
        required: false,
    },
});

module.exports = mongoose.model('links', linksSchema, 'links');