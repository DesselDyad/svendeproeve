const search = require('../../mongo/modules/search');

module.exports = (app) => {
    //searching route
    app.post('/search', search.search);
}