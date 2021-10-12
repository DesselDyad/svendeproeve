var mongoose = require('mongoose');

// Contact Info Model
module.exports = mongoose.model('Contact_Info', 
    mongoose.Schema({
        name: {
            type: String
        },
        adress: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        phone: {
            type: Number
        },
        fax: {
            type: Number
        },
        email: {
            type: String
        }
    }),'contact_info'
)