const advertisement = require('../db/advertisements');
const res_loader = require('../../services/res_loader');
const image_handler = require('../../services/image_handler');

/**
 * @module Advertisement
 */

module.exports = {
    /**
     * gets a single advertisement by ID
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingle: async (req, res) => {
        try {
            let ad = await advertisement.getSingle(req.params.id);
            res.send(ad);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * adds a single advertisement
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    addSingle: async (req, res) => {
        try {
            let fileName;
            //check for image is blank
            if(req.file) {
                fileName = await image_handler.uploadAdImage(req.file);
            }
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await advertisement.addSingle(req, fileName);
            //check for image or text is empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.ad_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //check for taken 
            else if(response.ad_error) {
                obj.error_msg = response.ad_error;
                obj.ad_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //success case
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * updates a single advertisement
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateSingle: async (req, res) => {
        try {
            let fileName;
            //check for image is blank
            if(req.file) {
                fileName = await image_handler.uploadAdImage(req.file);
            }
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await advertisement.updateSingle(req, fileName);
            //check for image or text is empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.ad_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //check for taken
            else if(response.ad_error) {
                obj.error_msg = response.ad_error;
                obj.ad_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * deletes a single advertisement
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    deleteSingle: async (req, res) => {
        try {
            let response = await advertisement.deleteSingle(req.params.id);
            res.send(response);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets a single advertisement price
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSinglePrice: async (req, res) => {
        try {
            console.log('do you get here yes i get here')
            let price = await advertisement.getSinglePrice(req.params.id);
            res.send(price);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * adds a single advertisement price
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    addSinglePrice: async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await advertisement.addSinglePrice(req);
            //check for views or price is empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.price_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //check for one of either is taken
            else if(response.price_error) {
                obj.error_msg = response.price_error;
                obj.price_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //success case
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * updates a single advertisement price
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateSinglePrice: async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await advertisement.updateSinglePrice(req);
            //checks for empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.price_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //checks for taken
            else if(response.price_error) {
                obj.error_msg = response.price_error;
                obj.price_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //success case
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets a single advertisement price
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    deleteSinglePrice: async (req, res) => {
        try {
            let response = await advertisement.deleteSinglePrice(req.params.id);
            res.send(response);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets the description for how to ones advertisement shown
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getDescription: async (req, res) => {
        try {
            let description = await advertisement.getDescription();
            res.send(description);
        }
        catch (e) {
            console.log(e);
        }
    },
    
    /**
     * updates the description for how one gets ones advertisement shown
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateDescription: async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await advertisement.updateDescription(req);
            //check for empty description
            if(response.errors) {
                obj.errors = response.errors;
                obj.description_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //success case
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