'use strict';

/**
 * So, yo, check it -
 * Here's docs for the spotify api: https://github.com/thelinmichael/spotify-web-api-node
 */

const express       = require('express'),
      spotifyWebApi = require('spotify-web-api-node'),
      User          = require('../models/user'),
      Song          = require('../models/song'),
      mid           = require('../middleware'),
      router        = express.Router();

const spotifyApi = new spotifyWebApi({
    clientId: '17d81671aacf46519078e7629844450d',
    clientSecret: '5be1b9a0a8674ce88a165b08ca993f1e',
    redirectUri: 'http://localhost:3000/songs/test/'
});

router.get('/in', (req,res,next) => {
    return res.render('spotify-in', {title: "Logged in stuff"});
});

module.exports = router;