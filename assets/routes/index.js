//include public and admin routes in running app
module.exports = app => {
    require('./admin/index')(app);
    require('./public/index')(app);
}