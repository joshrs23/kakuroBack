const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        index: {
            unique: true, 
            dropDups: true
        },
    },

    username: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups:true // Question, what is this?
        }

    },
    fname:{
        type: String,
        required: true,
    },
    lname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
}) 

usersSchema.path('email').validate(async(email)=>{

    const count = await mongoose.models.users.countDocuments({email});

    return !count;

}, 'Email already exists.')

usersSchema.path('email').validate((email)=>{

    const emailFormat =  email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/);

    return emailFormat;

}, 'The format of the email is wrong.')

usersSchema.path('password').validate((password)=>{

    const passwordCount =  password.length > 7 && password.length < 21;

    return passwordCount;

}, 'Password size has to be minimun 8 values and maximun 20 characters.')


// Validate username doesn't exist

usersSchema.path('username').validate(async(username)=>{

    const count = await mongoose.models.users.countDocuments({username});

    return !count;

}, 'Username already exists.')


//Validate username format

usersSchema.path('username').validate((username)=>{

    const usernameFormat =  username.match(/^[a-zA-Z0-9_.-]*$/); //Change match ^[a-zA-Z0-9_.-]*$

    return usernameFormat;

}, 'The format of the username is wrong.')


usersSchema.pre('save', function(next){
    if(this.isModified('password')){
        bcrypt.hash(this.password, 9 , (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        })
    }
})

usersSchema.methods.comparePassword = async function(password) {
    if(!password) throw new Error('Password is missing.')
    try{
        const result = await bcrypt.compare(password, this.password);
        return result;
    }catch(err){
        console.log('Error in password validation.', err.message)
    }
};

module.exports = mongoose.model('users', usersSchema)