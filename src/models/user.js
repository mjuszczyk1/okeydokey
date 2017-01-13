/**
 * You got here from index.js!
 * 
 * we learned about this shit when doing groovy/grails in school, so
 * don't need to write much about schemas that's not already written
 * inline, so go look around for notes.
 *
 * I'll put some mongo CLI commands here to view whats in there from
 * terminal:
 *   -> mongo : to open CLI
 *.  -> use okeydokey : this is the table name, which is set in app.js
 *.  -> show collections : these are the... tables?... in the okeydokey.... table?...
 *.  -> db.users.find() : finds all documents in the user table, prints it on one line, shitty, so..
 *.  -> db.users.find().pretty() : to pretty print the json objects
 */

// Schema for User entry in DB:
const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt'),
      SALT_APPLY_AMMOUNT = 10;

// Create schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,//type of var
        unique: true,//unique entry, no 2 peep with same email 
        required: true,//has to be filled out
        trim: true//takes of trailing whitespace
    },
    name: {type: String, required: true, trim: true},
    favoriteGenre: {type: String, required: true, trim: true},
    password: {type: String, required: true}
});

// authenticate input
UserSchema.statics.authenticate = (email, password, cb) => {
    User.findOne({email: email})// Queries DB, looking for a matching email address.
        .exec((error, user) => {//going to be executing something on that user
            if (error){
                return cb(error);// Bad error
            } else if (!user) {
                const err = new Error('User not found.');
                err.status = 401;
                return cb(err);//Probably typed in wrong email.
            }
            //Need to compare plain text password to Encrypted, so use the bcrypt compare method.
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    return cb(null, user);
                } else {
                    return cb();
                }
            });
        });
}

// hash pass before saving
UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_APPLY_AMMOUNT, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;