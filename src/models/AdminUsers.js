const mongoose = require('mongoose') 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const Task = require('./task')
const AdminUsersSchema = new mongoose.Schema({
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
    avatar: {
        type: Buffer
    }
})
AdminUsersSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
AdminUsersSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
AdminUsersSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}
AdminUsersSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to log in')
    }
    return user
}

//Hash the plaintext password before saving
AdminUsersSchema.pre('save', async function (next){
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//Delete user tasks when user is removed
AdminUsersSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const AdminUser = mongoose.model('AdminUser', AdminUsersSchema)

module.exports = AdminUser