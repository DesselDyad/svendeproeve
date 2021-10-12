const Advertisement = require('../../models/advertisement');
const AdvertisementPrice = require('../../models/advertisement_prices');
const AdvertisementDescription = require('../../models/advertisement_description');
const Category = require('../../models/category');

/**
 * @module Advertisement
 */

module.exports = {
    /**
     * gets the descrption for how to get ones advertisement shown
     * @returns {object} - the description
     */
    getDescription: () => {
        return new Promise((resolve, reject) => {
            AdvertisementDescription.find({})
            .exec()
            .then(description => {
                resolve(description);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * updates the descrption for how to get ones advertisement shown
     * @param {object} req - the request object
     * @returns {object} - a success or failure message
     */
    updateDescription: req => {
        return new Promise((resolve, reject) => {
            req.checkBody('text', 'Beskrivelsen må ikke være tom!').notEmpty();
            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else  {
                AdvertisementDescription.updateOne({_id: req.params.id}, {
                    $set: {
                        text: req.body.text
                    }
                }, (err, res) => {
                    if(err) reject(err);
                    resolve({
                        'success_msg': 'Du har succesfuldt opdateret beskrivelsen til hvordan man får sin reklame op på siden!'
                    });
                })
            }
        })
    },
    /**
     * gets all advertisements
     * @returns {object} - all advertisements
     */
    getAllAdvertisements: () => {
        return new Promise((resolve, reject) => {
            Advertisement.find({})
            .sort('category')
            .populate('category')
            .exec()
            .then(advertisements => {
                resolve(advertisements);
            })
            .catch(e => {
                reject(e)
            })
        })
    },
    /**
     * gets ALL frontpgae sidebar advertisements (non-page-specific)
     * @returns {object} - all advertisements
     */
    getGeneralSideBarAdvertisements: () => {
        return new Promise((resolve, reject) => {
            Advertisement.find({})
            .populate('category')
            .exec()
            .then(advertisements => {
                //retrieve 5 random advertisements and resolve
                var randAds = []; 
                while(randAds.length < 5) {
                    randAds[randAds.length] = advertisements.splice(Math.floor(Math.random() * advertisements.length), 1)[0];
                }
                resolve(randAds);
            })
            .catch(err => {
                reject(err);
            })
        })
    },
    /**
     * gets ALL bike sidebar advertisements (bike-page-specific)
     * @returns {object} - all bike advertisements
     */
    getBikeAdvertisements: () => {
        return new Promise((resolve, reject) => {
            Category.find({'query_name': 'bikes'})
            .exec()
            .then(category => {
                Advertisement.find({'category': category[0]._id})
                .populate('category')
                .exec()
                .then(advertisements => {
                    //retrieve 5 random advertisements and resolve
                        var randAds = []; 
                        while(randAds.length < 5) {
                            randAds[randAds.length] = advertisements.splice(Math.floor(Math.random() * advertisements.length), 1)[0];
                        }
                    resolve(randAds);
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
     * gets ALL boat sidebar advertisements (boat-page-specific)
     * @returns {object} - all boat advertisements
     */
    getBoatAdvertisements: () => {
        return new Promise((resolve, reject) => {
            Category.find({'query_name': 'boats'})
            .exec()
            .then(category => {
                Advertisement.find({'category': category[0]._id})
                .populate('category')
                .exec()
                .then(advertisements => {
                    //retrieve 5 random advertisements and resolve
                        var randAds = []; 
                        while(randAds.length < 5) {
                            randAds[randAds.length] = advertisements.splice(Math.floor(Math.random() * advertisements.length), 1)[0];
                        }
                    resolve(randAds);
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
     * gets ALL car sidebar advertisements (car-page-specific)
     * @returns {object} - all car advertisements
     */
    getCarAdvertisements: () => {
        return new Promise((resolve, reject) => {
            Category.find({'query_name': 'cars'})
            .exec()
            .then(category => {
                Advertisement.find({'category': category[0]._id})
                .populate('category')
                .exec()
                .then(advertisements => {
                    //retrieve 5 random advertisements and resolve
                        var randAds = []; 
                        while(randAds.length < 5) {
                            randAds[randAds.length] = advertisements.splice(Math.floor(Math.random() * advertisements.length), 1)[0];
                        }
                    resolve(randAds);
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
     * gets a single advertisement by id
     * @param {object} id - the id by which to get a single advertisement
     * @returns {object} - a single advertisement
     */
    getSingle: id => {
        return new Promise((resolve, reject) => {
            Advertisement.find({_id: id})
            .exec()
            .then(ad => {
                resolve(ad);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * adds a single advertisement
     * @param {object} req - the request object
     * @param {object} fileName - the name of the image (plus extension)
     * @returns {object} - a success or failure message
     */
    addSingle: (req, fileName) => {
        return new Promise((resolve, reject) => {
            let category = req.body.category,
                text = req.body.text,
                adImage;
                if (fileName != null || fileName != undefined) {
                    adImage = fileName;
                } else {
                    resolve({
                        ad_error: 'Der skal vælges et billede, ellers giver reklamen ingen mening!'
                    })
                }
            
            req.checkBody('text','Reklame teksten må ikke være tom!').notEmpty();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                Advertisement.find({img:adImage})
                .exec()
                .then(ad => {
                    if(ad.length>0) {
                        resolve({
                            ad_error: 'En reklame med dette billede findes allerede - vælg et andet!'
                        })
                    } else {
                        let newAd = new Advertisement({
                            img: adImage,
                            text: text,
                            category: category
                        })
                        newAd.save(newAd, (err, res) => {
                            if(err) reject(err);
                            resolve({
                                'success_msg': 'Reklame blev succesfuldt tilføjet!'
                            })
                        })
                    }
                })
                .catch(e => {
                    reject(e);
                })
            }
        })
    },
    /**
     * updates a single advertisement
     * @param {object} req - the request object
     * @param {object} fileName - the name of the image (plus extension)
     * @returns {object} - a success or failure message
     */
    updateSingle: (req, fileName) => {
        return new Promise((resolve, reject) => {
            console.log(req.body);
            let category = req.body.category,
                text = req.body.text,
                adImage;
                if (fileName != null || fileName != undefined) {
                    adImage = fileName;
                }
                else {
                    adImage = req.body.oldImage;
                }
            
            req.checkBody('text','Reklame teksten må ikke være tom!').notEmpty();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                Advertisement.find({img:adImage})
                .exec()
                .then(ad => {
                    if(ad.length>0 && ad[0]._id != req.params.id) {
                        resolve({
                            ad_error: 'En reklame med dette billede findes allerede - vælg et andet!'
                        })
                    } else {
                        Advertisement.findOneAndUpdate({_id:req.params.id}, {
                            img: adImage,
                            text: text,
                            category: category
                        }, (err, res) => {
                            if(err) reject(err);
                            resolve({
                                'success_msg': 'Reklame blev succesfuldt opdateret!'
                            })
                        })
                    }
                })
                .catch(e => {
                    reject(e);
                })
            }
        })
    },
    /**
     * deletes a single advertisiement by id
     * @param {object} id - the id by which to delete advertisement
     * @returns {object} - nothing important really, feedback shown by client side script
     */
    deleteSingle: id => {
        return new Promise((resolve, reject) => {
            Advertisement.findByIdAndDelete({_id: id})
            .exec()
            .then(response => {
                resolve(response);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * updates a single advertisiement by id
     * @param {object} id - the request object
     * @returns {object} - a success or failure message
     */
    getSinglePrice: id => {
        return new Promise((resolve, reject) => {
            AdvertisementPrice.find({_id: id})
            .exec()
            .then(price => {
                resolve(price);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * adds a single advertisement price
     * @param {object} req - the request object
     * @returns {object} - a success or failure message
     */
    addSinglePrice: req => {
        return new Promise((resolve, reject) => {
            let views = req.body.views,
                price_per_view = req.body.price;
            
            req.checkBody('views','Antal visninger må ikke være tomme og må udelukkende indeholde tal!').notEmpty().isNumeric();
            req.checkBody('price','Pris per visning må ikke være tom og må udelukkende indeholde tal!').notEmpty().isNumeric();
            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                AdvertisementPrice.find({
                    views: views
                })
                .exec()
                .then(res => {
                    if(res.length > 0) {
                        resolve({
                            price_error: 'Denne størrelse visninger findes allerede, vælg en anden!'
                        })
                    } else {
                        AdvertisementPrice.find({
                            price_per_view: price_per_view
                        })
                        .exec()
                        .then(result => {
                            if(result.length > 0) {
                                resolve({
                                    price_error: 'En størrelse visninger med denne pris findes allerede, vælg en anden!'
                                })
                            } else {
                                let newPrice = new AdvertisementPrice({
                                    views: views,
                                    price_per_view: price_per_view 
                                })
                                newPrice.save(newPrice, (err, res) => {
                                    if(err) reject(err);
                                    resolve({
                                        'success_msg': "Pris per visning tilføjet succesfuldt!"
                                    })
                                })
                            }
                        })    
                    }
                })
            }
        })
    },
    /**
     * updates a single advertisement price
     * @param {object} req - the request object
     * @returns {object} - a success or failure message
     */
    updateSinglePrice: req => {
        return new Promise((resolve, reject) => {
            let views = req.body.views,
                price_per_view = req.body.price;
            
            req.checkBody('views','Antal visninger må ikke være tomme og må udelukkende indeholde tal!').notEmpty().isNumeric();
            req.checkBody('price','Pris per visning må ikke være tom og må udelukkende indeholde tal!').notEmpty().isNumeric();
            if(req.validationErrors()) {
                console.log('gets in here')
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                AdvertisementPrice.findOneAndUpdate({_id: req.params.id}, {
                    views: views,
                    price_per_view: price_per_view 
                }, (err, res) => {
                    if(err) reject(err);
                    resolve({
                        'success_msg': "Pris per visning opdateret succesfuldt!"
                    })
                })
            }
        })
    },
    /**
     * deletes a single advertisement price by id
     * @param {object} id - the id by which to delete the price
     * @returns {object} - a success or failure message
     */
    deleteSinglePrice: id => {
        return new Promise((resolve, reject) => {
            AdvertisementPrice.findByIdAndDelete({_id: id})
            .exec()
            .then(price => {
                resolve(price.img);
            })
            .catch(e => {
                reject(e);
            })
        })
    }
}