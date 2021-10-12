var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
require('./assets/config/passport');
mongoose.connect(require('./assets/config/config').url, { useNewUrlParser: true });
var db = mongoose.connection;

// Init App
var app = express();

// View Engine
// app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/assets/views');
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
console.log(__dirname);
app.use(express.static(path.join(__dirname, '/public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: db,
        ttl: 30 * 60,
        autoRemove: 'interval',
        autoRemoveInterval: 30 // In minutes. Default
    })
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
//check out the console once an error is thrown somewhere (by express-validator), this decides how that error is built
//tho i dont entirely comprehend the inner workings
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
//once i used these for usability, but i kind of forgot about them and now i dont have the time to test which ones can be deleted,
//and added them here in case EJS throws error because they weren't set
//setting them here essentally is the same as storing them in the res.object in a route (as in res.render, someObjectThatWillNowBeAccessible in EJS)
//could be replaced by -- if(typeof whatever != 'undefined')
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.users = req.users || null;
    res.locals.user_err = req.user_err || null;
    res.locals.mail = req.mail || null;
    res.locals.errors = req.errors || null;
    res.locals.req_body = req.req_body || null;
    next();
});

require('./assets/routes/index')(app);
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server started on http://localhost:' + app.get('port'));
});