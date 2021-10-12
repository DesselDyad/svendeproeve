const Contact_Message = require('../../models/contact_message');

/**
 * @module
 */

module.exports = {
    /**
     * stores a contact message in the database
     * @param req - the request object
     * @returns {Object} - a success ro failure message
     */
    sendMessage: req => {
        return new Promise((resolve, reject) => {
            let name = req.body.name,
                email = req.body.email,
                topic = req.body.topic,
                message = req.body.message;

            req.checkBody('name', 'Navn må ikke være tomt!').notEmpty();
            req.checkBody('email', 'Email er påkrævet og skal være en valid email!').notEmpty().isEmail();
            req.checkBody('topic', 'Emne må ikke være tomt!').notEmpty();
            req.checkBody('message', 'Besked må ikke være tomt!').notEmpty();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                let newMessage = new Contact_Message({
                    sender_name: name,
                    sender_email: email,
                    topic: topic,
                    message: message
                });
                newMessage.save(newMessage, (err, response) => {
                    if(err) reject(err);
                    resolve({
                        'success_msg': 'Meddelelse blev succesfuldt sendt afsted!'
                    })
                })
            }
        })
    }
}