const mongoose = require('mongoose');

const boardSchema  = new mongoose.Schema({
    
    levelId: {
        type: String, 
        required: true
    },
    board: {
        type: Array, 
        required: true
    }
}) 


module.exports = mongoose.model('levels', boardSchema )