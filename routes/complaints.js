const express = require('express');
const router = express.Router();

const renderer = require('../config/renderer_config');

// Bring in models
let Complaints = require('../models/complaints');
let Users = require('../models/users');

// Edit single complaint
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Complaints.findById(req.params.id, function (err, complaint) {
        if (err) {
            console.log(err);
        }
        else {
            if (complaint.author != req.user._id) {
                req.flash('danger', 'Not authorized');
                res.redirect('/');
            }
            res.render('edit_complaint', {
                title: 'Edit Complaint',
                complaint: complaint
            });
        }
    });
});

// Assign engineer to  complaint
router.get('/assign/:id', ensureAuthenticated, function (req, res) {
    Complaints.findById(req.params.id, function (err, complaint) {
        Users.find({ type: 'engineer' }, function (err, engineer) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Engineer',engineer);

                if (req.user.type != 'admin') {
                    req.flash('danger', 'Not authorized');
                    res.redirect('/');
                }
                res.render('assign_engineer', {
                    title: 'Assign Engineer',
                    complaint: complaint,
                    engineer: engineer
                });
            }


        });
    });
});

//Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_complaints', {
        title: 'Add Complaints'
    })
});

// Post new complaint
router.post('/add', ensureAuthenticated, function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    // Get errors
    let errors = req.validationErrors();
    if (errors) {
        res.render('add_complaints', {
            title: 'Add Complaint',
            errors: errors
        });
    } else {
        let complaint = new Complaints();
        complaint.title = req.body.title;
        complaint.author = req.user._id;
        complaint.body = req.body.body;
        complaint.status = 'Registered';
        complaint.engineer = 'none';

        complaint.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Complaint Added successfully');
                res.redirect('/');
            }
        });
    }
});

// Update complaint
router.post('/edit/:id', function (req, res) {
    let complaint = {};
    complaint.title = req.body.title;
    complaint.author = req.body.author;
    complaint.body = req.body.body;
    complaint.status = 'registered';
    complaint.engineer = 'none';

    let query = { _id: req.params.id }

    Complaints.updateOne(query, complaint, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Complaint Updated successfully');
            res.redirect('/');
        }
    });
});

// Update complaint Engineer
router.post('/assign/:id', function (req, res) {
    let complaint = {};
    complaint.engineer = req.body.engineer;
    complaint.status = 'assigned';

    let query = { _id: req.params.id }

    Complaints.updateOne(query, complaint, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Engineer Added successfully');
            res.redirect('/');
        }
    });
});

// Update Complaint Status
router.post('/solve/:id', function (req, res) {
    let complaint = {};
    complaint.status = 'Solved';

    let query = { _id: req.params.id }

    Complaints.updateOne(query, complaint, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Complaint solved successfully');
            res.redirect('/');
        }
    });
});


// Deleting route
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }
    console.log(req.params.id);
    let query = { _id: req.params.id };

    Complaints.findById(req.params.id, function (err, complaint) {
        if (complaint.author != req.user._id) {
            res.status(500).send();
        } else {
            Complaints.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success!!!');
            });
        }
    });
});

// Get single complaint
router.get('/:id', function (req, res) {
    Complaints.findById(req.params.id, function (err, complaint) {
        Users.findById(complaint.author, function (err, user) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('complaint', {
                    complaint: complaint,
                    author: user.name
                });
            }
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}
module.exports = router;