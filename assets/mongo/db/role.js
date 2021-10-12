const Role = require('../../models/role');

/**
 * @module Role
 */

module.exports = {
    /**
     * gets all roles
     * @returns {Object} - all roles
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            Role.find({})
            .exec()
            .then(roles => {
                resolve(roles);
            })
            .catch(e => {
                reject(e);
            })
        })
    }
}