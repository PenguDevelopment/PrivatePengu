const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    bank: {
        type: Number,
        required: true,
    },
    inventory: {
        type: Array,
        required: true,
    },
    faction: {
        type: String,
        required: true,
    },
    members: {
        type: Number,
        required: true,
    },
    clanname: {
        type: String,
        required: true,
    },
    memberslist: {
        type: Array,
        required: true,
    },
    leafs: {
        type: Number,
        required: true,
    },
    meat: {
        type: Number,
        required: true,
    },
    fish: {
        type: Number,
        required: true,
    },
    insects: {
        type: Number,
        required: true,
    },
    clanimage: {
        type: String,
        required: true,
    },
    clanturns: {
        type: Number,
        required: true,
    },
    clanbanner: {
        type: String,
        required: false,
    },
    lastRefill: {
        type: Number,
        required: false,
    },
    lastDaily: {
        type: Number,
        required: false,
    },
    codesRedeemed: {
        type: Array,
        required: false,
    },
    lastWork: {
        type: Number,
        required: false,
    },
    lastRob: {
        type: Number,
        required: false,
    },
    level: {
        type: Number,
        required: true,
    },
    xp: {
        type: Number,
        required: true,
    },
    xpneeded: {
        type: Number,
        required: true,
    },
    clanlevel: {
        type: Number,
        required: true,
    },
    clanxp: {
        type: Number,
        required: true,
    },
    clanxpneeded: {
        type: Number,
        required: true,
    },
    uncommonFish: {
        type: Number,
        required: false,
    },
    rareFish: {
        type: Number,
        required: false,
    },
    epicFish: {
        type: Number,
        required: false,
    },
    job: {
        type: String,
        required: false,
    },
    jobLevel: {
        type: Number,
        required: false,
    },
    jobXP: {
        type: Number,
        required: false,
    },
});
module.exports = mongoose.model('pengu', schema, 'pengu');