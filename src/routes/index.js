/**
 *  We're here from app.js.
 *  We get here when user requests a route, basically via the URL.
 *  The view engine is set in app.js, so we don't need to worry about that here,
 *  we can just use res.render().
 *
 * The render() method goes to the directory set in the line after setting 'view engine'.
 *
 * For the most part, this is pretty self explanitory. The next flow comes from the
 * POST /register route
 * There's some simple data checking in there to make sure everything is at least filled out,
 * and also checking to make sure passwords match.
 * To persist the user to the DB, we use the schema located in the models folder called
 * user.js
 *
 * One thing to remember which I always seemed to efff up was using
 * the same names from template to backend. So just know that the 
 * req.body.name for example, 
 *   req is the client request.
 *   body is the body of the request
 *   and name is the name attribute of the input element -> check out register.pug for that shiz.
 * 
 * 
 * Go there for next notes.
 */

const express = require('express'),
      User    = require('../models/user'),
      router  = express.Router();


// GET /
router.get('/', (req,res,next) => {
    return res.render('index', {title: 'Home'});
});

// GET /register
router.get('/register', (req,res,next) => {
    return res.render('register', {title: 'Register'});
});

// POST /register
router.post('/register', (req,res,next) => {
    if (req.body.email && 
        req.body.name && 
        req.body.favoriteGenre && 
        req.body.password && 
        req.body.confirmPassword) {

        //confirm passwords match
        if (req.body.password !== req.body.confirmPassword) {
            let err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        // create obj to supply DB with:
        const userData = {
            email:         req.body.email,
            name:          req.body.name,
            favoriteGenre: req.body.favoriteGenre,
            password:      req.body.password
        };

        // use schemas create method
        User.create(userData, (error, user) => {
            if (error){
                return next(error);
            } else {
                return res.redirect('/profile');
            }
        });

    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

// GET /profile
router.get('/profile', (req,res,next) => {
    return res.render('profile', {title: 'Account'})
});

// GET /songs
router.get('/songs', (req,res,next) => {
    return res.render('songs', {title: 'Songs'});
});

// export it so we can use it in app.js
module.exports = router;