/**
 * Middleware functions run in the middle...
 * Take a look at routes/index.js to see how they are used/
 * 
 * In that file, we first require this file so we can use these functions.
 * These run before the callback function of the routes. So if something
 * goes wrong in here, we will return a template accordingly. Take the 
 * loggedOut function for example - if a user is logged in (ie, has a 
 * session and session.userId), it will return them to their profile page.
 * This function will be used on routes like login and register, since 
 * if your logged in, you don't need those pages.
 * 
 * Take a look at the GET /profile route, for how a similar thing can happen
 * directly in the route. That is not the preferred way, because we'd end up
 * repeating ourselves a lot, and that's just not good practice.
 *
 */

function loggedOut(req,res,next){
    if (req.session && req.session.userId) {// if user is logged in,
        return res.redirect('/profile');// return them to their profile.
    }
    // else, use the next step, which will just send you to the correct route, no redirect needed.
    return next();
}


function requiresLogin(req,res,next){
    if (req.session && req.session.userId) {//if user logged in, we don't need to do anything so..
        return next();// just go to the next() step!
    } else {// Non logged in person...
        const err = new Error('You must be logged in to view this page');
        err.status = 401;
        return next(err);
    }
}

module.exports.loggedOut     = loggedOut;
module.exports.requiresLogin = requiresLogin;