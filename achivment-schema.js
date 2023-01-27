const { Schema, model } = require('mongoose');

const schema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    achievements: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        reward: {
            type: String,
            required: true
        }
    }]
});

module.exports =  model('achivment', schema, 'achivment');