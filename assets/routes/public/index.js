//includes all public routes in running app
module.exports = app => {
    require('./advertisement')(app);
    require('./contact')(app);
    require('./navigation')(app);
    require('./newsletter')(app);
    require('./role')(app);
    require('./search')(app);
    require('./user')(app);
    require('./article')(app);
    require('./category')(app);
}