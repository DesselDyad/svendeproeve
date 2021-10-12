var mongoose = require('mongoose');

// Role Model
module.exports = mongoose.model('Role', 
    mongoose.Schema({
        name: {
            type: String
        },
        display_name: {
            type: String
        }
    }),'roles'
)