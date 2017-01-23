'use strict';

const express       = require('express'),
      User          = require('../models/user'),
      Song          = require('../models/song'),
      mid           = require('../middleware'),
      router        = express.Router();

// GET /songs
router.get('/', (req,res,next) => {
    Song.find({}, (err, songs) => {
        if (err) return next(err);
        return res.render('songs', {title: 'Songs', songs: songs});
    }); 
});

// GET /songs/add
router.get('/add', mid.requiresLogin, (req,res,next) => {
    return res.render('add-song', {title: "Add Song"});
});

// POST /songs/add
router.post('/add', mid.requiresLogin, (req,res,next) => {
    // It is at this point in app creation that I will pivot
    // and do this more like a Spotify playlist builder
    // To do this, I'll have to check if the song exists in
    // Spotify using their API. 
    if (req.body.songTitle && req.body.songArtist) {
        const songData = {
            title: req.body.songTitle,
            album: req.body.songAlbum,
            artist:  req.body.songArtist,
            year: req.body.songYear,
            bpm: req.body.songBPM
        };
        // use schemas create() method
        Song.create(songData, (error, user) => {
            if (error){
                return next(error);
            } else {
                return res.redirect('/songs');
            }
        });
    } else {
        const err = new Error("Title and Artist are required");
        err.status = 400;
        return next(err);
    }
});

module.exports = router;