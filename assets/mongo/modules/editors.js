//for page specific loading
const editors = require('../db/editors');

//load page data
let res_loader = require('../../services/res_loader');
/**
 * @module ContactInfo
 */
module.exports = {
    /**
     * gets a a single editor by ID
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - a single editor
     */
    getSingle: async (req, res) => {
        try {
            let _editor = await editors.getSingle(req.params.id);
            res.send(_editor);
        }
        catch (e) {
            console.log(e);
        } 
    },
    /**
     * gets all the editors
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - all editors
     */
    getAll: async (req, res) => {
        try {
            let _editors = await editors.getAll();
            res.send(_editors);
        }
        catch (e) {
            console.log(e);
        } 
    }
}