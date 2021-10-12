var mongoose = require('mongoose');

// Subscriber Model
module.exports = mongoose.model('Subscriber', 
    mongoose.Schema({
        email: {
            type: String
        }
    }),'subscribers'
)