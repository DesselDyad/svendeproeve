const Sponsor = require('../../models/advertisement_prices');

/**
 * @module Sponsor
 */

module.exports = {
    /**
     * gets all advertisement prices
     * @returns {Object} - all advertisement prices
     */
    getPrices: () => {
        return new Promise((resolve, rejec) => {
            Sponsor.find({})
            .sort({views:1})
            .exec()
            .then(prices => {
                resolve(prices);
            })
            .catch(err => {
                reject(err);
            })
        })
    }
}