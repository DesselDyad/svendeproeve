const Article = require('../../models/article');
const Category = require('../../models/category');
const Role = require('../../models/role');
const User = require('../../models/user');

/**
 * @module search
 */

module.exports = {
    /**
     * queries the databases articles for a keyword
     * 
     * @param req - the request object
     * @returns {Object} - the searchresults
     */
    search: req => {
        return new Promise((resolve, reject) => {
            let param = req.body.search; 
            req.checkBody('search', 'Du kan ikke søge tomt!').notEmpty();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                //gets all categories where query_name, menu_name or editor_name match the query param
                Category.find(
                    {$or: 
                    [
                        {
                          query_name: {
                              '$regex': new RegExp(param, 'i')
                          }  
                        },
                        {
                          menu_name: {
                            '$regex': new RegExp(param, 'i')
                          }  
                        },
                        {
                          editor_name: {
                            '$regex': new RegExp(param, 'i')
                          }  
                        }
                    ]
                })
                .exec()
                .then(categories => {
                    //gets all roles where role name matches the query param
                    Role.find({name: 'editor'})
                    .exec()
                    .then(role => {
                        User.find({
                            name: {
                                '$regex': new RegExp(param, 'i')
                            },
                            role: role[0]._id
                        })
                        .distinct('_id')
                        .exec()
                        .then(editors => {
                            //having gathered arrays of roles and editors (even if only containing single values, or none)
                            //query article title, author and category for query param
                            Article.find({
                                $or: [
                                {
                                    'title': 
                                    {'$regex': new RegExp(param, 'i')}
                                },
                                {
                                    'author': {
                                        $in: editors
                                    }
                                },
                                {
                                    'category': {
                                        $in: categories
                                    }
                                },
                                {
                                    'content.opening': {
                                        '$regex': param, '$options': 'i'   
                                    }
                                },
                                {
                                    'content.paragraphs.subtitle': {
                                        '$regex': param, '$options': 'i'   
                                    }
                                },
                                {
                                    'content.paragraphs.sections': {
                                        '$regex': param, '$options': 'i'   
                                    }
                                }
                            ]})
                            .populate([{path: 'category'}, {path: 'author'}])
                            .exec()
                            .then(articles => {
                                //resolve whatever was found along with a pre-built response
                                resolve({
                                'success_msg': '<span>Din søgning på <strong>' + param + '</strong>returnerede <strong>' + articles.length + '</strong>resultater</span>',
                                'articles': articles});
                            })
                            .catch(e => {
                                reject(e);
                            })
                        })
                        .catch(e =>  {
                            reject(e);
                        })
                    })
                    .catch(e => {
                        reject(e);
                    })
                })
                .catch(e => {
                    reject(e);
                })
            }
        })
    }
}