const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const renderer = require('../config/renderer_config');


// Bring in models
let Users = require('../models/users');

// Register Form
router.get('/register',function(req,res){

    if (renderer === 'pug')
        res.render('register');
    else
        res.render('signup');
});

router.post('/register', function (req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Get errors
    let errors = req.validationErrors();
    if (errors) {
        if (renderer === 'pug')
            res.render('register', {
                errors: errors
            });
        else
            res.render('signup', {
                errors: errors
            });

    } else {

        let newUser = new Users({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            type:'user'
        });
    
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

// Add engineer Form
router.get('/add',function(req,res){
    res.render('add_engineer');
});

router.post('/add', function (req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Get errors
    let errors = req.validationErrors();
    if (errors) {
        if (renderer === 'pug')
            res.render('register', {
                errors: errors
            });
        else
            res.render('signup', {
                errors: errors
            });

    } else {

        let newUser = new Users({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            type:'engineer'
        });
    
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'Engineer is now registered and can log in');
                        res.redirect('/');
                    }
                });
            });
        });
    }
});


// Login Form
router.get('/login',function(req,res){
    if (renderer === 'pug')
        res.render('login');
    else
        res.render('signin');
});

// Login Process
router.post('/login', function(req,res,next){
    passport.authenticate('local',{
        failureFlash:true,
        successRedirect:'/',
        failureRedirect:'/users/login'
    })(req,res,next);
});

// Login Form
router.get('/logout',function(req,res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;