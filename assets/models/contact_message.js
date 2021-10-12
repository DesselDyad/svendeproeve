var mongoose = require('mongoose');

// Contact Message Model
module.exports = mongoose.model('Contact_Message', 
    mongoose.Schema({
        sender_name: {
            type: String
        },
        sender_email: {
            type: String
        },
        topic: {
            type: String
        },
        message: {
            type: String
        }
    }),'contact_messages'
)