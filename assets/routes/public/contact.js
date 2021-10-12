const contact_message = require('../../mongo/modules/contact_message');

module.exports = (app) => {
    //route for sending contact message
    app.post('/contact/send_message', contact_message.sendMessage);
}