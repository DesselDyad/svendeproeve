const Article = require('../../models/article');
const Category = require('../../models/category');
const Comment = require('../../models/comment');

/**
 * @module Article
 * contains database functionality for articles, comments and page-specific articles based upon on or all categories (and sidebar)
 */

module.exports = {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////// ARTICLE CRUD STUFF /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets a single article by id
     * @param id - the id by which to get the article 
     * @returns {Object} - A single article
     */
    getSingle: id => {
        return new Promise((resolve, reject) => {
            console.log('so you never get here do you')
            Article.find({ _id: id })
                .populate([{
                    path: 'author',
                    populate: {
                        path: 'role'
                    }
                },
                {
                    path: 'category'
                },{
                    path: 'comments',
                    options: {
                        sort: {
                            written: -1
                        }
                    }
                }])
                .exec()
                .then(article => {
                    resolve(article);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * Gets all the articles
     * @returns {Object} - All articles
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            Article.find({})
                .populate([{ path: 'author' }, { path: 'category' }, {path: 'comments'}])
                .sort({ written: 1 })
                .exec()
                .then(articles => {
                    resolve(articles);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * adds a single comment
     * @param req - tje request object
     * @returns {Object} - deletes a success or failure message
     */
    addArticle: req => {
        return new Promise( async (resolve, reject) => {
            req.checkBody('title', 'Overskrift må ikke være tom!').notEmpty();
            req.checkBody('category', 'Kategori skal være valgt!').notEmpty();

            if (req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                console.log(req.body)
                async function checkArrs() {
                    let flag = true;
                    for (var property in req.body) {
                        if (property.startsWith('paragraph')) {
                            req.body[property].forEach(entry => {
                                if (entry == '') {
                                    flag = false;
                                }
                            })
                        } else if (property.startsWith('entry')) {
                            req.body[property].forEach(item => {
                                if (item == '') {
                                    flag = false;
                                }
                            })
                        }
                    }
                    return flag;
                }
                async function update() {
                    let flag = await checkArrs();
                    if(flag == true) {
                        // create empty arrays
                        let temp = [],
                            paragraphs = [];
                        //using for...in, use property names to parse arrays holding data (subtitles & sections) for paragraphs object/array into temp array
                        for (var property in req.body) {
                            if (property.startsWith('paragraph')) {
                                temp.push(req.body[property])
                            }
                        }
                        //use asyncronously running for-loop to then parse those into objects, containing a subtitle and an array containing the sections
                        for (let i = 0; i < temp.length; i++) {
                            let obj = {
                                subtitle: temp[i][0],
                                sections: []
                            };
                            //splice out the first entry, parse the rest into the temp-objects array, and push the object into the paragraphs array at the end of each iteration
                            temp[i].splice(1).forEach(entry => {
                                obj.sections.push(entry);
                            })
                            paragraphs.push(obj);
                        }
                        //this all took surprisingly few lines of code to accomplish, gogo JS
                        let opening;
                        console.log(typeof req.body.opening)
                        if(typeof req.body.opening == 'string') {
                            opening = [req.body.opening]
                        }
                        //create
                        let newArticle = new Article({
                            title: req.body.title,
                            author: req.session.passport.user,
                            category: req.body.category,
                            content: {
                                opening: opening,
                                paragraphs: paragraphs
                            }
                        })
                        console.log(newArticle);
                        newArticle.save(newArticle, (err, res) => {
                            if(err) reject(err);
                            resolve({
                                'new_article': res,
                                'success_msg': 'Artikel oprettet!'
                            })
                        })
                        // Article.findOneAndU
                    } else {
                        resolve({
                            article_error: 'Der er en tom paragraf!'
                        })
                    }   
                }
                update();
            }

        })
    },
    /**
     * updates a single article
     * @param req - the request object
     * @returns {Object} - a success or failure message
     */
    updateArticle: req => {
        return new Promise( async (resolve, reject) => {
            req.checkBody('title', 'Overskrift må ikke være tom!').notEmpty();
            req.checkBody('editor', 'Redaktør skal være valgt!').notEmpty();
            req.checkBody('category', 'Kategori skal være valgt!').notEmpty();

            if (req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                async function checkArrs() {
                    let flag = true;
                    for (var property in req.body) {
                        if (property.startsWith('paragraph')) {
                            req.body[property].forEach(entry => {
                                if (entry == '') {
                                    flag = false;
                                }
                            })
                        } else if (property.startsWith('entry')) {
                            console.log('myproperty', req.body[property]);
                            if(typeof req.body[property] == 'string') {
                                if(req.body[property] == '') {
                                    flag = false;
                                }
                            } else {
                                req.body[property].forEach(item => {
                                    if (item == '') {
                                        flag = false;
                                    }
                                })
                            }
                        }
                    }
                    return flag;
                }
                async function update() {
                    let flag = await checkArrs();
                    if(flag == true) {
                        //create empty arrays
                        let temp = [],
                            paragraphs = [];
                        //using for...in, use property names to parse arrays holding data (subtitles & sections) for paragraphs object/array into temp array
                        for (var property in req.body) {
                            if (property.startsWith('paragraph')) {
                                temp.push(req.body[property])
                            }
                        }
                        //use asyncronously running for-loop to then parse those into objects, containing a subtitle and an array containing the sections
                        for (let i = 0; i < temp.length; i++) {
                            let obj = {
                                subtitle: temp[i][0],
                                sections: []
                            };
                            //splice out the first entry, parse the rest into the temp-objects array, and push the object into the paragraphs array at the end of each iteration
                            temp[i].splice(1).forEach(entry => {
                                obj.sections.push(entry);
                            })
                            paragraphs.push(obj);
                        }
                        //this all took surprisingly few lines of code to accomplish, gogo JS
        
                        //set remaining properties to be used for populating the updated article
                        let title = req.body.title,
                            written = req.body.written,
                            author = req.body.editor,
                            category = req.body.category,
                            opening;
                        if(typeof req.body.entry == 'string') {
                            opening = [req.body.entry]
                        } else {
                            opening = req.body.entry;
                        }
                        //update
                        Article.findOneAndUpdate({ _id: req.params.id }, {
                            title: title,
                            written: written,
                            author: author,
                            category: category,
                            content: {
                                opening: opening,
                                paragraphs: paragraphs
                            }
                        }, (err, res) => {
                            if (err) reject(err);
                            resolve({
                                'updatedArticle': res,
                                'success_msg': 'Du har succesfuldt opdateret artiklen!'
                            })
                        })
                    } else {
                        resolve({
                            article_error: 'Der er en tom paragraf!'
                        })
                    }   
                }
                update();
            }

        })
    },
    /**
     * delete a single article
     * @param id - the id by which to delete
     * @returns {Object} - deletes a single article
     */
    deleteArticle: id => {
        return new Promise((resolve, reject) => {
            Article.find({_id: id})
            .exec()
            .then(article => {
                if(article[0].comments.length > 0) {
                    article[i].comments.forEach(comment => {
                        Comment.findOneAndRemove({_id:comment.id}, (err, res) => {
                            if(err) reject(err);
                        })
                    })
                }
                Article.findOneAndRemove({_id:article[0]._id}, (err, res) => {
                    if(err) reject(err);
                    resolve(res);
                })
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////PAGE SPECIFIC ARTICLE STUFF /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets all the articles
     * @returns {Object} - All articles
     */
    getFrontPageArticles: () => {
        return new Promise((resolve, reject) => {
            Article.find({})
                .populate([{ path: 'author' }, { path: 'category' }])
                .sort({ written: 1 })
                .limit(6)
                .exec()
                .then(articles => {
                    resolve(articles);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * Gets all articles for bike category
     * @returns {Object} - All bike articles
     */
    getBikeArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'bikes' })
                .exec().
                then(category => {
                    console.log(category[0]._id)
                    Article.find({ category: category[0]._id })
                        .populate([{ path: 'category' }, { path: 'author' }])
                        .then(articles => {
                            resolve(articles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    /**
     * Gets all articles for boat category
     * @returns {Object} - All boat articles
     */
    getBoatArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'boats' })
                .exec().
                then(category => {
                    Article.find({ category: category[0]._id })
                        .populate([{ path: 'category' }, { path: 'author' }])
                        .then(articles => {
                            resolve(articles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    /**
     * Gets all articles for car category
     * @returns {Object} - All car articles
     */
    getCarArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'cars' })
                .exec().
                then(category => {
                    Article.find({ category: category[0]._id })
                        .populate([{ path: 'category' }, { path: 'author' }])
                        .then(articles => {
                            resolve(articles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////// SIDEBAR ARTICLE STUFF /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets all sidebar articles, non-page-specific
     * @returns {Object} - All sidebar articles
     */
    getGeneralSideBarArticles: () => {
        return new Promise((resolve, reject) => {
            Article.find({})
                .populate([{ path: 'author' }, { path: 'category' }])
                .sort({ viewCount: -1 })
                .limit(6)
                .exec()
                .then(articles => {
                    resolve(articles);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * Gets all boat-specific sidebar articles
     * @returns {Object} - All boat specfic sidebar articles
     */
    getBoatSideBarArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'boats' })
                .exec()
                .then(category => {
                    Article.find({ 'category': category[0]._id })
                        .populate('category')
                        .sort({ viewCount: -1 })
                        .exec()
                        .then(articles => {
                            //retrieve 5 random articles and resolve
                            var randArticles = [];
                            while (randArticles.length < 5) {
                                randArticles[randArticles.length] = articles.splice(Math.floor(Math.random() * articles.length), 1)[0];
                            }
                            resolve(randArticles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * Gets all bike-specific sidebar articles
     * @returns {Object} - All boat specfic sidebar articles
     */
    getBikeSideBarArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'bikes' })
                .exec()
                .then(category => {
                    Article.find({ 'category': category[0]._id })
                        .populate('category')
                        .sort({ viewCount: -1 })
                        .exec()
                        .then(articles => {
                            //retrieve 5 random articles and resolve
                            var randArticles = [];
                            while (randArticles.length < 5) {
                                randArticles[randArticles.length] = articles.splice(Math.floor(Math.random() * articles.length), 1)[0];
                            }
                            resolve(randArticles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /**
     * Gets all car-specific sidebar articles
     * @returns {Object} - All boat specfic sidebar articles
     */
    getCarSideBarArticles: () => {
        return new Promise((resolve, reject) => {
            Category.find({ 'query_name': 'cars' })
                .exec()
                .then(category => {
                    Article.find({ 'category': category[0]._id })
                        .populate('category')
                        .sort({ viewCount: -1 })
                        .exec()
                        .then(articles => {
                            //retrieve 5 random articles and resolve
                            var randArticles = [];
                            while (randArticles.length < 5) {
                                randArticles[randArticles.length] = articles.splice(Math.floor(Math.random() * articles.length), 1)[0];
                            }
                            resolve(randArticles);
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////// COMMENT STUFF /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets a single comment by id
     * @param id - the id by which to get the comment 
     * @returns {Object} - A single comment
     */
    getSingleComment: id => {
        return new Promise((resolve, reject) => {
            Comment.find({_id:id})
            .exec()
            .then(comment => {
                resolve(comment);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * updates a single comment 
     * @param req - the request object
     * @returns {Object} - A failure or success message
     */
    updateComment: req => {
        return new Promise((resolve, reject) => {
            req.checkBody('comment','Kommentar kan ikke være tom!').notEmpty();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                Comment.findOneAndUpdate({_id:req.params.id}, {
                    'comment': req.body.comment 
                }, (err, res) => {
                    if(err) reject(err);
                    resolve({
                        'success_msg': 'Du har succesfuldt opdateret kommentaren!'
                    })
                })
            }
        })
    },
    /**
     * posts a single comment
     * @param req - the request object
     * @returns {Object} - A failure or success message
     */
    postComment: req => {
        return new Promise((resolve, reject) => {
            console.log(req.body);
            let name = req.body.name,
                email = req.body.email,
                comment = req.body.comment;

            req.checkBody('name', 'Navn må ikke være tomt!').notEmpty();
            req.checkBody('email', 'Email må ikke være tom og skal være gyldig email!').notEmpty().isEmail();
            req.checkBody('comment', 'Kommentar må ikke være tom!').notEmpty();

            if (req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                let newComment = new Comment({
                    written: new Date().toLocaleString('en-GB', {timeZone: 'GMT'}),
                    email: email,
                    author: name,
                    comment: comment
                })
                newComment.save(newComment, (err, comment) => {
                    if(err) reject(err)
                    else {
                        Article.updateOne({ _id: req.params.id }, {
                            $push: {
                                comments: comment._id
                            }
                        },{upsert:true})
                        .exec()
                        .then(response => {
                            resolve({ 'success_msg': 'succesfuldt sendt!' })
                        })
                        .catch(err => {
                            reject(err);
                        })
                    }
                })
            }
        })
    },
    /**
     * delete a single comment
     * @param id - the id by which to delete
     * @returns {Object} - deletes a single comment
     */
    deleteComment: id => {
        return new Promise((resolve, reject) => {
            console.log(id)
            Article.find({comments: id
            })
            .exec()
            .then(article => {
                let comments = article[0].comments;
                console.log(comments);
                let newComments = [];
                for(let i = 0; i < comments.length; i++) {
                    if(comments[i] != id) {
                        newComments[i] = comments[i];
                    }
                }
                console.log(newComments);
                Article.findOneAndUpdate({_id:article[0]._id}, {comments: newComments}, (err, res) => {
                    if(err) reject(err);
                    Comment.findOneAndRemove({_id:id}, (err, res) => {
                        if(err) reject(err);
                        resolve(res);
                    })
                    
                })
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * updates an articles viewCount
     * @param id - the id pointing to the articles whichs viewCount is to be incremented
     * @returns {Object} - a success or failure message
     */
    updateViewCount: id => {
        return new Promise((resolve, reject) => {
            Article.find({_id:id})
            .exec()
            .then(article => {
                Article.updateOne({_id:id}, {
                    $set: {
                        viewCount: article[0].viewCount+1
                    }
                },
                (err, res) => {
                    if(err) reject(err);
                    resolve(res);
                })
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////// VARIOUS ARTICLE STUFF //////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets articles based on a single category
     * @param id - the id pointing to the category 
     * @returns {Object} - Articles belonging to the single category
     */
    getSingleCategory: id => {
        return new Promise((resolve, reject) => {
            Article.find({category:id})
            .populate([{ path: 'author' }, { path: 'category' }, {path: 'comments'}])
            .exec()
            .then(articles => {
                resolve(articles);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * Gets a single category by author id
     * @param id - the author id by which to get the category 
     * @returns {Object} - A single category
     */
    getSingleAuthor: id => {
        return new Promise((resolve, reject) => {
            console.log(id)
            Article.find({author:id})
            .populate([{ path: 'author' }, { path: 'category' }, {path: 'comments'}])
            .exec()
            .then(articles => {
                console.log(articles)
                resolve(articles);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
}