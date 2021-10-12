var mongoose = require('mongoose');

// Advertisement model
module.exports = mongoose.model('Advertisement', 
    mongoose.Schema({
        img: {
            type: String
        },
        text: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Category'
        }
    }),'advertisements'
)