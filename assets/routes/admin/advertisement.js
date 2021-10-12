const advertisements = require('../../mongo/modules/advertisement');
const security = require('../../services/security');
const multer = require("multer");
const upload = multer({
    dest: "./temp/images/"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = app => {
    //add, update & delete routes for advertisements
    app.post('/admin/ad/addSingle', security.ensureAuthenticated, upload.single('adImage'), advertisements.addSingle);
    app.post('/admin/ad/updateSingle/:id', security.ensureAuthenticated, upload.single('adImage'), advertisements.updateSingle);
    app.get('/admin/ad/deleteSingle/:id', security.ensureAuthenticated, advertisements.deleteSingle);
    //add, update & delete routes for advertisement prices
    app.post('/admin/ad/addSinglePrice', security.ensureAuthenticated, advertisements.addSinglePrice);
    app.post('/admin/ad/updateSinglePrice/:id', security.ensureAuthenticated, advertisements.updateSinglePrice);
    app.get('/admin/ad/deleteSinglePrice/:id', security.ensureAuthenticated, advertisements.deleteSinglePrice);
    app.post('/admin/ad/updateDescription/:id', security.ensureAuthenticated, advertisements.updateDescription);
}