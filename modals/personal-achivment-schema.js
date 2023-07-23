const { Schema, model } = require('mongoose');

const schema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    achievements: [],
    stats: {}
});

module.exports = model('personalachivment', schema, 'personalachivment');