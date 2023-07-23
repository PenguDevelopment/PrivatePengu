const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: false
    },
    votes: {
        type: Object,
        required: true
    },
    answers: {
        type: Array,
        required: false
    },
    status: {
        type: Object,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    userId: {
        type: Array,
        required: true
    },
    reviewMessageId: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('suggest', schema, 'suggest');