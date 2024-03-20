const mongoose = require('mongoose');

const historiesSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        index: {
            unique: true, 
            dropDups: true
        },
    }
}) 

historiesSchema.path('name').validate(async(name)=>{

    const count = await mongoose.models.histories.countDocuments({name});

    return !count;

}, 'history already exists.')


module.exports = mongoose.model('histories', historiesSchema)