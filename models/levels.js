const mongoose = require('mongoose');

const levelsSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        index: {
            unique: true, 
            dropDups: true
        },
    }
}) 

levelsSchema.path('name').validate(async(name)=>{

    const count = await mongoose.models.levels.countDocuments({name});

    return !count;

}, 'Level already exists.')


module.exports = mongoose.model('levels', levelsSchema)