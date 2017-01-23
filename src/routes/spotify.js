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

// GET /songs/test
router.get('/test', (req,res,next) => {
    /**
     * So I don't go through the headache again...
     * If the artist string ain't nothing (lets say "woeifj2839uf8v9j"),
     * It doesn't necessariy return an error. So we won't get to the
     * Callback function that has the 'err' param. So we need to check
     * When the data is 'good' to make sure that total > 0.
     * If it's not, we'll need a way to flash a message that says 
     * Artist not found, er something like that.
     */
    return res.render('spotify', {title: "Spotify API"});
});

// Get artist ID
/**
 * So initially, this isn't a very helpful thing either.
 * It does find the artist ID quickly, so that could be used
 * in other things, but for the most part, this is super
 * simple, meant to just demonstrate some functionality.
 */
router.get('/test/getArtistId', (req,res,next) => {
    // Set up variable for user's entered artist:
    const artist = req.query.artist;
    // Now time to query API:
    spotifyApi.searchArtists(artist)
        .then((data) => {
            // Since the API doesn't return an 'error' if it doesn't
            // find anything, we have to manually check to make sure
            // that something was returned. Luckily, there's a 'total'
            // object in the array:
            if (data.body.artists.total > 0){
                // If there is an artist, just send the ID to the template:
                res.send(data.body.artists.items[0].id);
            } else {
                // No artist was found:
                res.send('No artist found');
            }
        }, (err) => {
            // This is fine because it means something is probably wrong with my
            // clientSecret, er something along those lines.
            return next(err);
    });
});

// Get related albums
/**
 * This is a route for get albums of the most related artist.
 * It sounds weird cause I just wanted to mess with the Spotify api
 * and get used to making calls. So brief overview - a user types
 * in an artists name. That name gets sent here and we find the first
 * related artist, then we return all of that artists albums 
 * (as long as they don't end in "Single").
 */
router.get('/test/getRelatedAlbums', (req,res,next) => {
    const artist = req.query.artist;
    spotifyApi.searchArtists(artist)// This is the original artist the user enters.
        .then((data) => {
            // We need to make sure something was actually returned, and 
            // Spotify didn't have trouble finding user entered artists:
            if (data.body.artists.total > 0){
                // If we're here, the entered artist was found.
                // Now it's time to find entered artists related artists.
                // That functionality requires the artist ID, so we need
                // to pass that to the function that finds related artist:
                spotifyApi.getArtistRelatedArtists(data.body.artists.items[0].id)
                    .then((data) => {
                        // If we're here, finding related artists went smoothly on the API end.
                        if (data.body.artists.length) {
                            // If we're here, this means that the artist has related artists,
                            // so next, all we need to do is find albums.

                            // first, I will start building a response array so we can display
                            // the most realted artist's name:
                            let response = [data.body.artists[0].name];

                            // Now to find the albums:
                            spotifyApi.getArtistAlbums(data.body.artists[0].id)
                                .then((data) => {
                                    // If we're here, we have albums. I want to remove all albums
                                    // that end in "Single" cause we really only want to show 
                                    // LPs. There might be a way to do this based on the Response,
                                    // but for now, this is a quick and dirty solution.
                                    console.log(data.body.items);
                                    for (let i = 0; i < data.body.items.length; i++) {
                                        if (data.body.items[i].album_type === "album") { 
                                            response.push(data.body.items[i].name);
                                        }
                                    }
                                    // Finally, we send our array off to the template to be rendered to the page:
                                    res.send(response);
                                }, (err) => {
                                    // This is if the API encounters an error when looking for albums.
                                    return next(err);
                                });
                        } else {
                            res.send('No related artists');
                        }
                    }, (err) => {
                        // This would be an API error when trying to find related artists.
                        return next(err);
                    });
            } else {
                // This would run if the entered artist didn't have any related artists
                res.send('No artist found');
            }
        }, (err) => {
            // If there's an error with the API, it goes here.
            return next(err);
    });
});

module.exports = router;