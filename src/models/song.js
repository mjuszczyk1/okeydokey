/**
 * See models/user.js for details about model files.
 * When something comes up that is specific to the song model,
 * I'll write that in here. But for now, nothing.
 *
 */

// Schema for User entry in DB:
const mongoose = require('mongoose');

// Create schema
var SongSchema = new mongoose.Schema({
    title: {
        type: String,//type of var
        required: true,//has to be filled out
        trim: true//takes of trailing whitespace
    },
    album: {type: String, trim: true},
    artist: {type: String, required: true, trim: true},
    year: {type: Number, trim: true},
    bpm: {type: Number, trim: true}
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;