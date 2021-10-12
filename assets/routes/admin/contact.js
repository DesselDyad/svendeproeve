const contact_info = require('../../mongo/modules/contact_info');
const security = require('../../services/security');

module.exports = (app) => {
    //updates the pages contact info
    app.post('/admin/updateContactInfo', security.ensureAuthenticated, contact_info.update);
}