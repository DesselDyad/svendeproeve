const Category = require('../../models/category');
const mongoose = require('mongoose');

/**
 * @module Categories
 */

module.exports = {
    /**
     * gets all categories
     * @returns {Object} - all categories
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            Category.find({})
            .sort('menu_order')
            .exec()
            .then(categories => {
                resolve(categories);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets all categories which are in a users array
     * @param user - the user whoms category array to check up against
     * @returns {Object} - all categories which correspond with the users
     */
    getAllForEditArticle: user => {
        return new Promise((resolve, reject) => {
            let myArr = [];
            for(let i = 0; i < user.category.length; i++) {
                myArr[i] =  new mongoose.mongo.ObjectID(user.category[i]);
            }
            Category.find({
                _id: {$in: myArr}
            })
            .sort('menu_order')
            .exec()
            .then(categories => {
                resolve(categories);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets the menu items
     * @returns {Object} - all menu items
     */
    getMenuItems: () => {
        return new Promise((resolve, reject) => {
            Category.find({})
            .sort('menu_order')
            .exec()
            .then(categories => {
                resolve(categories);
            })
            .catch(err => {
                reject(err);
            })
        })
    },
    /**
     * updates the categories (essentially, updates the order in which they are shown)
     * @param req - the request object
     * @returns {Object} - a success or failure message
     */
    updateCategories: req => {
        return new Promise((resolve, reject) => {
            let bikes = req.body.bikes,
                boats = req.body.boats,
                cars = req.body.cars;
            
            req.checkBody('bikes','Må ikke være tom').notEmpty().not().equals(boats).not().equals(cars);
            req.checkBody('boats','Må ikke være tom').notEmpty().not().equals(bikes).not().equals(cars);
            req.checkBody('cars','Må ikke være tom').notEmpty().not().equals(bikes).not().equals(boats);

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                let temp = [];
                //create anonymous array to update menu orders 
                [{
                    'category_name': 'bikes',
                    'menu_order': bikes
                },{
                    'category_name': 'boats',
                    'menu_order': boats
                },{
                    'category_name': 'cars',
                    'menu_order': cars
                }].forEach(category => {
                    //for each category in that array, update
                    Category.findOneAndUpdate({'query_name': category.category_name}, {$set: {
                        'menu_order': category.menu_order
                    }},
                    (err, res) => {
                        if(err) reject(err);
                        //utilize the temp array to check when all 3 have been updated - avoids synchronity issues
                        temp.push(res);
                        if(temp.length == 3) {
                            resolve({
                                'success_msg': 'Alle blev opdateret succesfuldt'
                            })
                        }
                    })
                })
            }
        })
    }
}