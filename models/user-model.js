const mongoose = require('mongoose');
const { Schema } = mongoose;
const Anime = require('./anime-model');


const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: { type: [{ type: Schema.Types.ObjectId, ref: 'Anime' }], default: [] }
}, {
    collection: 'userData'
})

const model = mongoose.model('User', User);

module.exports = model;