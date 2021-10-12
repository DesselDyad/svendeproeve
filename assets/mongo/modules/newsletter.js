const newsletter = require('../db/newsletter');
const res_loader = require('../../services/res_loader');
const articles = require('../db/article');
const service_newsletter = require('../../services/newsletter');

/**
 * @module Newsletter
 */

module.exports = {
    /**
     * stores an email in the database and sense a corresponding e-mail
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    subscribe: async (req, res) => {
        try {
            let obj = await res_loader.data();
            obj.articles = await articles.getFrontPageArticles();
            let response = await newsletter.addSubcriber(req);
            //check if anything was empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.newsletter_body = req.body;
                obj.title = 'Forside';
                res.render('pages/', obj);
            }
            //check if the e-mail entered is in use
            else if(response.email_error) {
                obj.error_msg = response.email_error;
                obj.newsletter_body = req.body;
                obj.title = 'Forside';
                res.render('pages/', obj);
            }
            //success case
            else if(response.success_msg) {
                //send e-mail
                let _response = await service_newsletter.subscriberAdded(req.params.email);
                req.flash('success_msg', response.success_msg);
                res.redirect('/');
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    /**
     * deletes a subscriber rrom the database and sense a corresponding e-mail
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - all contact info
     */
    unSubscribe: async (req, res) => {
        try {
            let response = await newsletter.removeSubscriber(req.params.email);
            let _response = await service_newsletter.unsubscribe(req.params.email);
            req.flash('success_msg', "Du har succesfuldt afmeldt dig!!");
            res.redirect('/');
        }
        catch (err) {
            console.log(err);
        }
    },
    /**
     * sends an email to a user requesting further validation of a newsletter subscription
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    requestUserValidation: async (req, res) => {
        try {
            let response = await service_newsletter.requestUserValidation(req.body.email);
            req.flash('success_msg', "En e-mail er blevet sendt til dig for yderligere konfirmation!");
            res.redirect('/');
        }
        catch (e) {
            console.log(e);
        }
    }
}