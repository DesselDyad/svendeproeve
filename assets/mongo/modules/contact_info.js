//for page specific loading
const contact_info = require('../db/contact_info');

//load page data
let res_loader = require('../../services/res_loader');
/**
 * @module ContactInfo
 */
module.exports = {
    /**
     * gets all the contact info
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - all contact info
     */
    get: async (req, res) => {
        try {
            let info = await contact_info.getAll();
            res.send(info);
        }
        catch (e) {
            console.log(e);
        } 
    },
    /**
     * updates all contact info
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - a success of failure message and possibly some pages ressources
     */
    update: async (req, res) => {
        try {
            let response = await contact_info.update(req);
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
			obj.title = "Admin";
            //check for empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.contact_info_body = req.body;
                res.render('pages/admin', obj);
            }
            //success
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        } 
    }
}