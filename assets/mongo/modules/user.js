const user = require('../db/user');
const image_handler = require('../../services/image_handler');
const res_loader = require('../../services/res_loader');

/**
 * @module User
 */

module.exports = {
    /**
     * Redirects a user after succesful login
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    login: async (req, res) => {
        req.flash('success_msg', 'You are now logged in!');
        res.redirect('/admin');
    },
    /**
     * Logs out a user and redirects
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    logout: (req, res) => {
        //req.logout => delete req.session.passport.user => i think

        //from passport.coma
        // Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. 
        // Invoking logout() will remove the req.user property and clear the login session (if any).
		req.logout();
		req.flash('success_msg', 'You are logged out');
		res.redirect('/user/login');
    },
    /**
     * gets a single user by id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingle: async (req, res) => {
        let _user = await user.getSingle(req.params.id);
        res.send(_user);
    },
    /**
     * gets all editors
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getAllEditors: async (req, res) => {
        try {
            let editors = await user.getAllEditors();
            res.send(editors);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * registers a user
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - a success or failure message and possibly some page ressources
     */
    registerUser: async (req, res) => {
        try {
            let fileName;
            //check for image is blank
            if(req.file) {
                fileName = await image_handler.uploadUserImage(req.file);
            }
            let obj = await res_loader.admin_data();
            obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await user.registerUser(req, fileName);
            //check for empty fields
            if(response.errors) {
                obj.errors = response.errors;
                obj.user_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //check for taken values
            else if(response.user_error) {
                obj.error_msg = response.user_error;
                obj.user_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //success
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    /**
     * registers a user
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - a success or failure message and possibly some page ressources
     */
    updateUser: async (req, res) => {
        try {
            let fileName;
            //check for image is blank
            if(req.file) {
                fileName = await image_handler.uploadUserImage(req.file);
            }
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await user.updateUser(req, fileName);
            //check for empty fields
            if(response.errors) {
                obj.errors = response.errors;
                obj.update_user_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //check for taken values
            else if(response.user_error) {
                obj.error_msg = response.user_error;
                obj.update_user_body = req.body;
                obj.title = 'Admin';
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
    },
    /**
     * deletes a user by id
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - nothing important, isn't used for anything
     */
    deleteUser: async (req, res) => {
        try {
            let fileName = await user.deleteUser(req.params.id);
            let response = await image_handler.deleteUserImage(fileName);
            res.send(response);
        }
        catch (e) {
            console.log(e);
        }
    }
}