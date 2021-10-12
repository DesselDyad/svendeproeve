const User = require('../../models/user');
const Category = require('../../models/category');
const user = require('./user');

/**
 * @module Editors
 */
module.exports = {
    /**
     * Gets a single editor based on req params id passed along from module
     * @returns {Object} - A single editor
     */
    getSingle: category => {
        return new Promise((resolve, reject) => {
            User.find({ 'category': category }, (err, editor) => {
                if (err) reject(err);
                else {
                    resolve(editor);
                }
            })
        })
    },
    /**
     * gets all editors
     * @returns {Object} - All editors sorted by category
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            let final = [];
            //get all categories (cars, boats, bikes)
            Category.find({})
            //sort the results by category name
            .sort('editor_name')
            .exec()
            .then(async categories=> {
                //for each returned category, find the editors with the corresponding category
                for(let i = 0; i < categories.length; i++) {
                    //build an array with those returned users to be able to sort them according to category on frontend-editorial-page
                    final.push({
                        'category': categories[i].editor_name,
                        users: await user.getAllUsersByCategory(categories[i]._id)
                    });
                }
            })
            //once everything is done, resolve with the populated array
            .then(() => {
                resolve(final);
            })
            .catch(err => {
                reject(err);
            })
        })
    }
}