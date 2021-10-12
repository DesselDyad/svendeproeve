const User = require('../../models/user');
const Role = require('../../models/role');
const security = require('../../services/security');

/**
 * @module User
 */

module.exports = {
    /**
     * gets a single user by id
     * @param id - the id by which to get the user
     * @returns {Object} - the queried user
     */
    getSingle: id => {
        return new Promise((resolve, reject) => {
            User.find({_id:id})
            .populate([
                {path: 'category'},
                {path: 'role'}
            ])
            .exec()
            .then(user => {
                resolve(user);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets all users
     * @param id - the id by which to get the user
     * @returns {Object} - the queried user
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            User.find({})
            .populate([{path: 'category'},{path: 'role'}])
            .exec()
            .then(users => {
                resolve(users);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets all users with a certain role
     * @param role_id - the role id by which to get the user
     * @returns {Object} - the queried user
     */
    getUserRole: role_id => {
        return new Promise((resolve, reject) => {
            Role.find({
                _id: role_id
            })
            .select('name')
            .exec()
            .then(role => {
                resolve(role[0].name);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets all editors (or rather, all users, since admin user technically also is an editor - can be filtered further in EJS)
     * @returns {Object} - the queried users
     */
    getAllEditors: () => {
        return new Promise((resolve, reject) => {
            User.find()
            .populate([{path: 'category'},{path: 'role'}])
            .exec()
            .then(users => {
                resolve(users);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    /**
     * gets all users belonging to a certain category
     * @param category - the category by which to get the users
     * @returns {Object} - the queried users
     */
    getAllUsersByCategory: category => {
        return new Promise((resolve, reject) => {
            Role.find({name: 'editor'})
            .exec()
            .then(role => {
                User.find({
                    'category': category})
                    .populate([{path: 'category'},{path:'role'}])
                .then(users => {
                    resolve(users);
                })
                .catch(err => {
                    reject(err);
                })
            })
            .catch(e => {
                console.log(e);
            })
        })
    },
    /**
     * Registers a user
     * @param {object} req - the request object containing the body and error validator
     * @param {String} fileName - the fileName of the user image to be stored in db, if any
     * @returns {String} - An error or success message
     */
	registerUser: (req, fileName = null) => {
		return new Promise(async (resolve, reject) => {
            let name = req.body.name, 
                username = req.body.username,
                email = req.body.email,
                profile_text = req.body.text,
                profile_img,
                category = req.body.category,
                role= req.body.role;
            if (fileName != null || fileName != undefined) {
                profile_img = fileName;
            }
            else {
                profile_img = req.body.oldImage;
            }
            console.log(req.body.category);

            // // Validation
            req.checkBody('category','Der skal vælges mindst én kategori!').notEmpty();
			req.checkBody('name', 'Navn er påkrævet').notEmpty();
			req.checkBody('username', 'Brugernavn er påkrævet').notEmpty();
			req.checkBody('text', 'Profiltekst er påkrævet').notEmpty();
			req.checkBody('email', 'Email er påkrævet og skal være gyldig').notEmpty().isEmail();

            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {
                // var errors = req.validationErrors();
                User.find({
                    username: username
                })
                .exec()
                .then(user=> {
                    if(user.length>0) {
                        resolve({user_error: 'Brugernavnet er allerede i brug, vælg et andet!'
                        })
                    } else {
                        User.find({
                            email: email
                        })
                        .exec()
                        .then(async user=> {
                            if(user.length>0) {
                                resolve({user_error: 'Email er allerede i brug, vælg et andet!'
                                })
                            } else {
                                User.find({
                                    name: name
                                })
                                .exec()
                                .then(async user=> {
                                    if(user.length>0) {
                                        resolve({user_error: 'Navn er allerede i brug, vælg et andet!'
                                        })
                                    } else {
                                        var newUser = new User({
                                            name: name,
                                            email: email,
                                            profile_text: profile_text,
                                            img: profile_img,
                                            role: role,
                                            category: category,
                                            username: username,
                                            password: await security.createPassword(username)
                                        });
                                        newUser.save(newUser, function (err, user) {
                                            if (err) reject(err);
                                            resolve({
                                                'success_msg': 'Used has been created!'
                                            });					
                                        });
                                    }
                                })
                                .catch(e => {
                                    reject(e);
                                })
                            }
                        })
                        .catch(e => {
                            reject(e);
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
     * Updates a user
     * @param {object} req - the request object containing the body and error validator
     * @param {String} fileName - the fileName of the user image to be stored in db, if any
     * @returns {String} - An error or success message
     */
	updateUser: (req, fileName = null) => {
		return new Promise(async (resolve, reject) => {
            console.log('gets here', req.body)
            // let username = req.body.username,
            let name = req.body.name, 
                username = req.body.username,
                email = req.body.email,
                profile_text = req.body.text,
                profile_img,
                category = req.body.category,
                role= req.body.role;
                if (fileName != null || fileName != undefined) {
                    profile_img = fileName;
                }
                else {
                    profile_img = req.body.oldImage;
                }
                console.log(category);
			// // Validation
			req.checkBody('name', 'Navn er påkrævet').notEmpty();
			req.checkBody('text', 'Profiltekst er påkrævet').notEmpty();
			req.checkBody('email', 'Email er påkrævet og skal være gyldig').notEmpty().isEmail();
			// req.checkBody('username', 'brugernavn er påkrævet og skal være gyldig').notEmpty();
            
            if(req.validationErrors()) {
                resolve({
                    errors: req.validationErrors()
                })
            } else {

                User.find({
                    username: username
                })
                .exec()
                .then(user=> {
                    if(user.length>0 && user[0].id != req.params.id) {
                        resolve({user_error: 'Brugernavnet er allerede i brug, vælg et andet!'
                        })
                    } else {
                        User.find({
                            email: email
                        })
                        .exec()
                        .then(user=> {
                            if(user.length>0 && user[0].id != req.params.id) {
                                resolve({user_error: 'Email er allerede i brug, vælg et andet!'
                                })
                            } else {
                                User.find({
                                    name: name
                                })
                                .exec()
                                .then(async user=> {
                                    if(user.length>0 && user[0].id != req.params.id) {
                                        resolve({user_error: 'Navn er allerede i brug, vælg et andet!'
                                        })
                                    } else {
                                        User.updateOne({_id:req.params.id}, {
                                            // username: username,
                                            name: name,
                                            email: email,
                                            profile_text: profile_text,
                                            img: profile_img,
                                            category: category,
                                            role: role
                                        },
                                        (err, res) => {
                                            if (err) reject(err);
                                            resolve({
                                                'success_msg': 'Du har succesfuldt opdateret brugeren!'
                                            });					
                                        })
                                    }
                                })
                                .catch(e => {
                                    reject(e);
                                })
                            }
                        })
                        .catch(e => {
                            reject(e);
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
     * deletes a single user by id
     * @param id - the id by which to delete the user
     * @returns {Object} - nothing important, feedback handled client side
     */
    deleteUser: id => {
        return new Promise((resolve, reject) => {
            User.findOneAndDelete({_id:id})
            .exec()
            .then(user => {
                console.log(user);
                resolve(user.img)
            })
            .catch(e => {
                reject(e);
            })
        })
    }
}