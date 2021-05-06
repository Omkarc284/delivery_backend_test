const mongoose = require('mongoose')
const validator = require('validator')

const DP_Users = mongoose.model('Delivery_Personnel',{
    username: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password cannot contain "password"!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true

        }
    }],
    createdby: {
        type: String,
        required: true,
        ref: 'AdminUser'

    }

})
module.exports = DP_Users