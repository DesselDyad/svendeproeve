const newsletter = require('../../mongo/modules/newsletter');

module.exports = (app) => {
    //routes for newsletter management (request further validation, actually subscribe & unsubscribe)
    app.get('/newsletter/subscribe/:email', newsletter.subscribe);
    app.get('/newsletter/unsubscribe/:email', newsletter.unSubscribe);
    app.post('/newsletter/requestUserValidation', newsletter.requestUserValidation);
}