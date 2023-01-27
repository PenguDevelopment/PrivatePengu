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
    achievements: [{
        name: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: false
        },
        role: {
            type: String,
            required: false
        },
        reward: {
            type: String,
            required: false
        }
    }],
    stats: [{
        messages: {
            type: Number,
            required: false
        },
        boosts: {
            type: Number,
            required: false
        },
        invites: {
            type: Number,
            required: false
        },
        reactions: {
            type: Number,
            required: false
        },
        kicks: {
            type: Number,
            required: false
        },
        bans: {
            type: Number,
            required: false
        },
        roles: {
            type: Number,
            required: false
        },
        completed: {
            type: Array,
            required: false
        }
    }]
});

module.exports = model('personalachivment', schema, 'personalachivment');