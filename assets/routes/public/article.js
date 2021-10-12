const articles = require('../../mongo/modules/articles');

module.exports = app => {
    //get single & all articles
    app.get('/article/getSingle/:id', articles.getSingle);
    app.get('/article/getAll', articles.getAll);
    //get single comment & post comment
    app.get('/article/getSingleComment/:id', articles.getSingleComment);
    app.post('/article/postComment/:id', articles.postComment);
    //get articles by single author & category
    app.get('/article/getSingleCategory/:id', articles.getSingleCategory);
    app.get('/article/getSingleAuthor/:id',  articles.getSingleAuthor);
}