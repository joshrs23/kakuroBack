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

usersSchema.path('_email').validate(async(_email)=>{

    const count = await mongoose.models.users.countDocuments({_email});

    return !count;

}, 'Email already exists.')

usersSchema.path('_email').validate((_email)=>{

    const emailFormat =  _email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/);

    return emailFormat;

}, 'The format of the email is wrong.')

usersSchema.path('_password').validate((_password)=>{

    const passwordCount =  _password.length > 7 && _password.length < 21;

    return passwordCount;

}, 'Password size has to be minimun 8 values and maximun 20 characters.')


usersSchema.pre('save', function(next){
    if(this.isModified('_password')){
        bcrypt.hash(this._password, 9 , (err, hash) => {
            if(err) return next(err);
            this._password = hash;
            next();
        })
    }
})

usersSchema.methods.comparePassword = async function(_password) {
    if(!_password) throw new Error('Password is missing.')
    try{
        const result = await bcrypt.compare(_password, this._password);
        return result;
    }catch(err){
        console.log('Error in password validation.', err.message)
    }
};

module.exports = mongoose.model('users', usersSchema)