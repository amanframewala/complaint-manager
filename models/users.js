let mongoose = require('mongoose');

// Complaints schema

let UserSchema = mongoose.Schema({
    name:{
        type:'String',
        required: true
    },
    email:{
        type:'String',
        required: true
    },
    username:{
        type:'String',
        required: true
    },
    password:{
        type:'String',
        required: true
    },
    type:{
        type:'String',
        required: true
    }
});

let Users = module.exports = mongoose.model('Users',UserSchema);