var mongoose = require('mongoose');

// Advertisement prices model
module.exports = mongoose.model('Advertisement_Price', 
    mongoose.Schema({
        views: {
            type: Number
        },
        price_per_view: {
            type: Number
        }
    }),'advertisement_prices'
)