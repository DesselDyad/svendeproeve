var mongoose = require('mongoose');

// Advertisement description model
module.exports = mongoose.model('AdvertisementDescription', 
    mongoose.Schema({
        text: {
            type: String
        }
    }),'advertisement_description'
)