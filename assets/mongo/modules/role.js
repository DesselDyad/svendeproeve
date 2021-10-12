const res_loader = require('../../services/res_loader');
const role = require('../db/role');

/**
 * @module Role
 */

module.exports = {
    /**
     * gets all roles
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - all roles
     */
    getAll: async (req, res) => {
        try {
            let roles = await role.getAll();
            res.send(roles);
        }
        catch (e) {
            console.log(e);
        }
    }
}