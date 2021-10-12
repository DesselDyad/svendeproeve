//categories db module
const categories = require('../db/categories');
//load page data
let res_loader = require('../../services/res_loader');

/**
 * @module Categories 
 */

module.exports = {
    /**
     * gets all categories
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getAll: async (req, res) => {
        try {
            let _categories = await categories.getAll();
            res.send(_categories);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets all categories where the category id is in a users category array - this name is wildly misleading, but i must have had a reason
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getAllForEditArticle: async (req, res) => {
        try {
            let _categories = await categories.getAllForEditArticle(req.user);
            res.send(_categories);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * updates a category
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateCategories: async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await categories.updateCategories(req);
            //checks whether anything is empty or is not a number
            if(response.errors) {
                obj.errors = response.errors;
                obj.categories_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin', obj);
            }
            //doesnt actually do anything, but possibly should
            else if(response.email_error) {
                obj.error_msg = response.categories_error;
                obj.categories_body = req.body;
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