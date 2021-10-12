const roles = require('../../mongo/modules/role');

module.exports = (app) => {
    //gets all roles
    app.get('/roles/getAll', roles.getAll);
}