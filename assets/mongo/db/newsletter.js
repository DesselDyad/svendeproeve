const Subscriber = require('../../models/subscriber');

/**
 * @module Newsletter
 */

module.exports = {
    /**
     * stores a subscriber in the database
     * @param req - the request object
     * @returns {Object} - a success or failure message
     */
    addSubcriber: req => {
        return new Promise((resolve, reject) => {
            Subscriber.find({'email': req.params.email}, (err, sub) => {
                if(err) {
                    reject(err);
                } else if(sub && sub != null && sub.length > 0) {
                    console.log(sub);
                    resolve({
                        email_error: "Email er allerede i brug, vælg en anden!"
                    })
                } else {
                    let newSub = new Subscriber({
                        email: req.params.email
                    });
                    newSub.save(newSub, (err, sub) => {
                        if(err) reject(err);
                        resolve({
                            'success_msg': 'Du har succesfuldt tilmeldt dig nyhedsbrevet!'
                        });
                    })
                }
                
            })
        })
    },
    /**
     * removes a subscriber from the database
     * @param email - the email by which to remove
     * @returns {Object} - a success or failure message
     */
    removeSubscriber: email => {
        return new Promise((resolve, reject) => {
            Subscriber.deleteOne({email: email}, (err, response) => {
                if(err) reject(err);
                resolve({
                    'success_msg': 'Du har succesfuldt afmeldt denne e-mail! ' + email
                });
            })
        })
    }
}