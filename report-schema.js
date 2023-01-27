const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('report', reportSchema, 'report');
