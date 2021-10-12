//requires all admin routes, including them in the running app
module.exports = app => {
    require('./contact')(app);
    require('./user')(app);
    require('./category')(app);
    require('./advertisement')(app);
    require('./article')(app);
}