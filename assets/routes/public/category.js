const categories = require('../../mongo/modules/categories');

module.exports = app => {
    //gets all categories & all categories based on user that is logged in
    app.get('/category/getAll', categories.getAll);
    app.get('/category/getAllForEditArticle', categories.getAllForEditArticle);
}