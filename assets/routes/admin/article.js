const article = require('../../mongo/modules/articles');
const security = require('../../services/security');

module.exports = app => {
    //add, update & delete routes for articles
    app.post('/admin/article/addNew', security.ensureAuthenticated, article.addArticle);
    app.post('/admin/article/updateArticle/:id', security.ensureAuthenticated, article.updateArticle);
    app.get('/admin/article/deleteArticle/:id', security.ensureAuthenticated, article.deleteArticle);
    //update & delete routes for comments (add/create only done via user page)
    app.post('/admin/article/updateComment/:id', security.ensureAuthenticated, article.updateComment);
    app.get('/admin/article/deleteComment/:id', security.ensureAuthenticated, article.deleteComment);
}