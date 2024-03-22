const mongoose = require('mongoose');

const historiesSchema = new mongoose.Schema({
    
    userId:{
        type: String,
        required: true,
    },
    level:{
        type: String,
        required: true,
    },
    time:{
        type: Number,
        required: true,
    }
}) 


module.exports = mongoose.model('histories', historiesSchema)