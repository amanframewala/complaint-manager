const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
const renderer = require('./config/renderer_config');

mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;


// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

// Init app
const app = express();
app.use(expressValidator());
// Express Validator
// var api = express.Router();
// api.use(expressValidator())

// Bring in models
let Complaints = require('./models/complaints');
let Users = require('./models/users');

// Load View engine
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', renderer);

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Express Session Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});



// ======================ROUTES=========================
// Home Route
app.get('/', function (req, res) {
    console.log(req.user)
    if (req.user === undefined) {
        res.redirect('/users/login');
        return;
    }
    else if (req.user.type === 'admin') {
        Complaints.find({}, function (err, complaints) {
            Users.find({ type: 'engineer' }, function (err, engineer) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(complaints[0]);
                    res.render('admin-content', {
                        title: 'All Complaints',
                        //                    reg_complaints   : complaints.filter(c => c.status == 'registered' || c.status === undefined),
                        reg_complaints: complaints,
                        engineers:engineer
                    });
                }
            });
        });
    }
    else if (req.user.type === 'user') {
        let query = { author: req.user._id };
        Complaints.find(query, function (err, complaints) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }

            Users.find({})
            if (renderer === 'pug')
                res.render('index', {
                    title: 'Complaints Registered',
                    complaints: complaints
                });
            else
                res.render('user-content', {
                    complaints: complaints
                });

        });
    }
    else {
        let query = { engineer: req.user._id };
        Complaints.find(query, function (err, complaints) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('engineer-content', {
                    title: 'Complaints Assigned',
                    complaints: complaints
                });
            }
        });

    }
});
// Route Files
let complaints = require('./routes/complaints');
let users = require('./routes/users');
app.use('/complaints', complaints);
app.use('/users', users);


// Starting server
app.listen(3000, function () {
    console.log('Server Listening on port 3000');
});

