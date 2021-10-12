const contact_message = require('../db/contact_message');
const res_loader = require('../../services/res_loader');
const mailer = require('../../services/mailer');

/**
 * @module Contact_Message
 */

module.exports = {
    /**
     * stores a contact message in the database and sense something corresponding to whomever the admin wants it sent to - hasnt been determined (also, there is no e-mail domain belonging to the site)
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    sendMessage: async (req, res) => {
        try {
            let obj = await res_loader.data();
            let response = await contact_message.sendMessage(req);
            //check if anything is empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.contact_body = req.body;
                obj.title = 'Kontakt';
                res.render('pages/contact', obj);
            }
            //success case
            else if(response.success_msg) {
                //send email
                let _res = await mailer.send_email('recipient@recipient.org', req.body.topic, `
                    <div>
                        <p>Kære Modtager</p>
                        <p>En gæst ved navn ${req.body.name} af siden Bil Båd & Bike har sendt dig en besked! : - </p>
                        <p>
                            ${req.body.message}
                        </p>
                        <p>Afsenderen's e-mail adresse er: ${req.body.email}</p>

                    </div>
                `);
                req.flash('success_msg', response.success_msg);
                res.redirect('/contact');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}