var mongoose = require('mongoose');

// User Model
module.exports = mongoose.model('User',
    mongoose.Schema({
        username: {
            type: String
        },
        password: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        img: {
            type: String
        },
        profile_text: {
            type: String
        },
        category: { 
            type: 
            [
                {type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
            ]
        },
        role: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Role'
        }
    }), 'users'
)