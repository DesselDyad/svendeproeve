var bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @module Security
 */
module.exports = {
    /**
     * creates a new password from a plain text string
     * @returns {Object} - the newly created, hashed, salted password
     */
    createPassword: (oldPW) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) reject(err);
                bcrypt.hash(oldPW, salt, function(err, newPW) {
                    if(err) reject(err);
                    resolve(newPW);
                });
            });
        })
    },
    /**
     * does exactly the same as the function above, don't know why i got both - probably leftover from earlier projects - not examining further right now
     * @returns {Object} - the hashed, salted password
     */
    hashPassword: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) reject(err);
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err) reject(err);
                    resolve(hash);
                });
            });
        })
    },
    /**
     * compares a hashed and encrypted password to a plain text one (used for login)
     */
    comparePassword: (candidatePassword, hash, callback) => {
        bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            if(err) reject(err);
            callback(null, isMatch);
        });
    },
    //basically checks for
    //if(req.session.passport.user)
    //built-in passport method/middleware, pretty much
    //if user exists, call next middleware, otherwise redirect to login page
    //used for route security
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        } else {
            req.flash('error_msg','You are not logged in');
            res.redirect('/user/login');
        }
    }
};