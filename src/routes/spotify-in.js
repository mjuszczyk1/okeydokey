'use strict';

/**
 * this is really hard to do...
 * Later on, if we go back to this, we can get the codes from
 * https://developer.spotify.com/
 */
/**
 * Scratch that ^, this is impossible. swear fo' god.
 * I got close following https://github.com/JMPerez/passport-spotify
 * I just think my main problem was I wasn't saving the access code
 * anywhere. I had it returning my email at one point, but couldn't
 * get it to do it again, and since it wasn't saving anything anywhere,
 * I still couldn't make authenticated calls. Basically, I wanted
 * to die all day long.
 */


const express       = require('express'),
      spotifyWebApi = require('spotify-web-api-node'),
      User          = require('../models/user'),
      Song          = require('../models/song'),
      mid           = require('../middleware'),
      request       = require('request'),
      router        = express.Router();


module.exports = router;