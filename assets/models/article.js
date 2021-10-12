var mongoose = require('mongoose');

// Article Model
module.exports = mongoose.model('Article',
    mongoose.Schema({
        title: {
            type: String
        },
        written: {
            type: String,
            default: new Date().toLocaleString('en-GB', {timeZone: 'GMT'})
        },
        author: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        category: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Category'
        },
        content: {
            type: {
                opening: {
                    type: [
                        {
                            type: String
                        }
                    ]
                },
                paragraphs: {
                    type: [
                        {
                            subtitle: {
                                type: String
                            },
                            sections: {
                                type: [
                                    {
                                        type: String
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        comments: {
            type: [
                {
                   type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
                }
            ],
            default: []
        },
        viewCount: {
            type: Number,
            default: 0
        }
    }), 'article'
)