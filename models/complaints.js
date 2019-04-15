let mongoose = require('mongoose');

// Complaints schema

let complaintSchema = mongoose.Schema({
    title:{
        type:'String',
        required: true
    },
    author:{
        type:'String',
        required: true
    },
    body:{
        type:'String',
        required: true
    },
    status:{
        type:'String',
        required: true
    },
    engineer:{
        type:'String',
        required: true
    },
    category:{
        type:'String',
        required: true
    }

});

let Complaint = module.exports = mongoose.model('Complaint',complaintSchema);