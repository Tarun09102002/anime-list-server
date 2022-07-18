const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnimeModel = new mongoose.Schema({
    animeId: { type: Number, required: true },
    animeDetails: {
        type: Object,
    }
})

const model = mongoose.model('Anime', AnimeModel);

module.exports = model;