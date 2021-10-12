var mongoose = require('mongoose');

// Category Model
module.exports = mongoose.model('Category', 
    mongoose.Schema({
        editor_name: {
            type: String
        },
        query_name: {
            type: String
        },
        menu_name: {
            type: String
        },
        menu_order: {
            type: Number
        }
    }),'categories'
)