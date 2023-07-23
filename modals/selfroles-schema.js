const mongoose = require('mongoose');

const schema = mongoose.Schema({
    guildID: {
        type: String,
        required: true,
    },
    panels: {
        type: Array,
        required: true
    },
})

module.exports = mongoose.model('selfroles', schema, 'selfroles');