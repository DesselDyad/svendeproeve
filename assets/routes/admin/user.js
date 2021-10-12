const users = require('../../mongo/modules/user');
const security = require('../../services/security');
const multer = require("multer");
const upload = multer({
    dest: "./temp/images/"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = (app) => {
    //add, update & delete routes for users
    app.post('/admin/user/addUser', security.ensureAuthenticated, upload.single('userImage'), users.registerUser);
    app.post('/admin/user/updateUser/:id', security.ensureAuthenticated, upload.single('userImage'), users.updateUser);
    app.get('/admin/user/deleteUser/:id', security.ensureAuthenticated, users.deleteUser);
}