const mailer = require('./mailer');

/**
 * @module Newsletter
 */
module.exports = {
    /**
     * Sends an email to the user requesting his validation to verify that he actually wanted to subscribe
     * @param {string} name - the request name
     * @param {string} email - the request email
     */
    requestUserValidation: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let recipient = email,
                    subject = 'Nyhedsbrev tilmelding efterspurgt, konfirmation krævet',
                    content = `
                            <b>Du har efterspurgt at tilmeldes vores nyhedsbrev!!</b>
                            Hvis du IKKE HAR SENDT DENNE E-MAIL kan du afmelde dig/fortryde ved at clicke på linket nedenfor: 
                            <a href="http://localhost:3000/newsletter/unsubscribe/${email}" >Afmeld!</a>
                            Ellers, hvis det var dig selv som efterspurgte denne tilmelding, click på linket nedefor for at tilmelde dig!: 
                            <a href="http://localhost:3000/newsletter/subscribe/${email}">Tilmeld!</a>
                        `;
                let rows = await mailer.send_email(recipient, subject, content);
                resolve(rows);
            }
            catch {e => {
                reject(e);
            }}
        })
    },
    /**
     * Subscribes a user to a newsletter using the name and email as a key/value pair
     * @param {string} name - the subscribers name
     * @param {string} email - the subscribers email
     */
    subscribe: (name,email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let recipient = email,
                    subject = 'Subscribe!',
                    content = `
                                <b>Du har nu med succes tilmeldt dig vores nyhedsbrev!!</b>
                                Fortryder du dette, click på linket nedenfor for at ændre det!: 
                                <a href="http://localhost:3000/newsletter/unsubscribe/${email}">Unsubscribe!</a>
                            `;
                let rows = await mailer.send_email(recipient, subject, content);
                resolve(rows);
            }
            catch {e => {
                reject(e);
            }}
        })
    },
    /**
     * Unsubscribes a user from a newsletter using the subscribers email
     * @param {string} email - the subscribers email
     */
    unsubscribe: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let recipient = email,
                    subject = 'Unsubscribe!',
                    content = `
                                <p>Du er blevet afmeldt!</p>
                            `;
                let rows = await mailer.send_email(recipient, subject, content);
                resolve(rows);
            }
            catch {e => {
                reject(e);
            }}
        })
    },
    /**
     * Informs a subscriber that he has been subscribed to a newsletter by admin/moderator and provides him with the possibility to unsubscribe again
     * @param {string} name - the subscribers name
     * @param {string} email - the subscribers email
     */
    subscriberAdded: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let recipient = email,
                    subject = 'Tilemldt nyhedsbrev!',
                    content = `
                                <p>
                                    Du er tilmeldt vores nyhedsbrev!!
                                    Hvis du ønsker at afmelde dig igen, click på linket nedenfor!!
                                </p>
                                <p>
                                    <a href="http://localhost:3000/newsletter/unsubscribe/${email}">
                                        Afmeld!
                                    </a>
                                </p>
                            `;
                let rows = await mailer.send_email(recipient, subject, content);
                resolve(rows);
            }
            catch {e => {
                reject(e);
            }}
        })
    }
}