var mongoose = require('mongoose');

// Sponsor Model - i dont actually use this for anything, thought there would be actual sponsors. But can theoretically be used to expand the system one day
module.exports = mongoose.model('Sponsor', 
    mongoose.Schema({
        name: {
            type: String
        }
    }),'sponsors'
)