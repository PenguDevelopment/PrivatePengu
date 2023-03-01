const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
    guildID: String,
    userId: String,
    linksThisMonth: Number,
});

module.exports = mongoose.model('link', linkSchema, 'link');