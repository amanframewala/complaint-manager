const express = require('express');
const router = express.Router();

// Bring in models
let Complaints = require('../models/complaints');




// Edit single complaint
router.get('/edit/:id', function (req, res) {
    Complaints.findById(req.params.id, function (err, complaint) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('edit_complaint', {
                title: 'Edit Complaint',
                complaint: complaint
            });
        }
    });
});

//Add Route
router.get('/add', function (req, res) {
    res.render('add_complaints', {
        title: 'Add Complaints'
    })
});

// Post new complaint
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
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
        complaint.author = req.body.author;
        complaint.body = req.body.body;

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

    let query = { _id: req.params.id }

    Complaints.update(query, complaint, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Complaint Updated successfully');
            res.redirect('/');
        }
    });
});

// Deleting route
router.delete('/:id', function (req, res) {
    console.log(req.params.id);
    let query = { _id: req.params.id };
    Complaints.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success!!!');
    });
});

// Get single complaint
router.get('/:id', function (req, res) {
    Complaints.findById(req.params.id, function (err, complaint) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('complaint', {
                complaint: complaint
            });
        }
    });
});
module.exports = router;