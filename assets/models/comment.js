var mongoose = require('mongoose');

// Comment model
module.exports = mongoose.model('Comment', 
    mongoose.Schema({
        written: {
            type: String,
            default: new Date().toLocaleString('en-GB', {timeZone: 'GMT'})
        },
        email: {
            type: String
        },
        author: {
            type: String
        },
        comment: {
            type: String
        }
    }),'comments'
)