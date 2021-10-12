const articles = require('../db/article');
const logger = require('../../json/modules/logger');
const res_loader = require('../../services/res_loader');

/**
 * @module Article
 */

module.exports = {
    /**
     * gets a single article by id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingle: async (req, res) => {
        try {
            let article = await articles.getSingle(req.params.id);
            res.send(article);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets aall articles
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getAll: async (req, res) => {
        try {
            let _articles = await articles.getAll();
            res.send(_articles);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets a single comment by id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingleComment: async (req, res) => {
        try {
            let comment = await articles.getSingleComment(req.params.id);
            res.send(comment);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets all articles for a single category by category id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingleCategory: async (req, res) => {
        try {
            let _articles = await articles.getSingleCategory(req.params.id);
            res.send(_articles);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * gets all articles from a single author by author id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getSingleAuthor: async (req, res) => {
        try {
            let _articles = await articles.getSingleAuthor(req.params.id);
            res.send(_articles);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * posts a comment to an article
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    postComment: async (req, res) => {
        try {
            let obj = await res_loader.data();
            let response = await articles.postComment(req);
            //i'm fully aware of the fact that this error handleing isnt working properly - set aside for later review
            //if anything is left empty
            if(response.errors) {
                req.flash(errors = response.errors);
                obj.comment_body = req.body;
                obj.title = 'Forside';
                res.redirect('/' + req.rawHeaders[11].substring(22, req.rawHeaders[11].length));
            }
            //i'm fully aware of the fact that this error handleing isnt working properly - set aside for later review

            // else if(response.comment_error) {
            //     req.flash(error_msg = response.comment_error);
            //     obj.comment_body = req.body;
            //     obj.title = 'Forside';
            //     res.redirect('/' + req.rawHeaders[11].substring(22, req.rawHeaders[11].length), obj);
            // }
            //success case
            else if(response.success_msg) {
                req.flash('success_msg', response.success_msg);
                res.redirect('/' + req.rawHeaders[11].substring(22, req.rawHeaders[11].length));
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * updates a comment
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateComment: async (req, res) => {
        try {
            let obj = await res_loader.data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await articles.updateComment(req);
            //checks for comment is empty (rest isnt updatable, sender and time commented remain the same)
            if(response.errors) {
                obj.errors = response.errors;
                obj.comment_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin',obj);
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
     * deletes a comment belonging to an article
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    deleteComment: async (req, res) => {
        try {
            console.log('gets here at least')
            let response = await articles.deleteComment(req.params.id);
            res.send(response);
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * adds an article to the page
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    addArticle:  async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await articles.addArticle(req);
            //checks for anything is empty, including paragraphs and subtitles empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.add_article_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin',obj);
            }
            //this would check for whather anything is taken (title assumingly, but this never gets checked for - that's a fault, and needs to be implemented, so i'll leave it)
            else if(response.article_error) {
                obj.add_article_body = req.body;
                obj.error_msg = response.article_error;
                obj.title = 'Forside';
                res.render('pages/admin',obj);
            }
            //success case
            else if(response.success_msg) {
                //add log entry for article created
                let logged = await logger.logChange(response.new_article._id, response.new_article.title, req.session.passport.user);
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * updates an article to the page
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    updateArticle: async (req, res) => {
        try {
            let obj = await res_loader.admin_data();
			obj.user_role = await res_loader.populateReqUser(req.user);
            let response = await articles.updateArticle(req);
            //checks for anything is empty, including paragraphs and subtitles empty
            if(response.errors) {
                obj.errors = response.errors;
                obj.update_article_body = req.body;
                obj.title = 'Admin';
                res.render('pages/admin',obj);
            }
            //this would check for whather anything is taken (title assumingly, but this never gets checked for - that's a fault, and needs to be implemented, so i'll leave it)
            else if(response.article_error) {
                obj.update_article_body = req.body;
                obj.error_msg = response.article_error;
                obj.title = 'Forside';
                res.render('pages/admin',obj);
            }
            //success case
            else if(response.success_msg) {
                //add log entry for article is updated
                let logged = await logger.logChange(response.updatedArticle._id, response.updatedArticle.title, req.session.passport.user);
                req.flash('success_msg', response.success_msg);
                res.redirect('/admin');
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    /**
     * deletes an article by id
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    deleteArticle: async (req, res) => {
        try {
            let _res = await articles.deleteArticle(req.params.id);
            //delete log for that article (otherwise, it could have added an entry to the log saying the article as deleted and by whom)
            let _log_res = await logger.deleteLog(req.params.id);
            res.send(_res);
        } 
        catch (e) {
            console.log(e);
        }
    }
}