const mongoose = require('mongoose');

const rainbowSchema = new mongoose.Schema({
    guildID: String,
    rainbowRoles: [],
});

module.exports = mongoose.model('rainbow-roles', rainbowSchema, 'rainbow-roles');