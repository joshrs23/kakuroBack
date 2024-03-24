const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    
    userId : {
        type: String,
        required: true,
    },
    time : {
        type: Date,
        default: Date.now  
    },
    status : {
        type: Boolean,
        default: true,
    },
    boardId :{
        type: String,
        required: true,
    },
    game : {
        type: Array, 
        required: true
    }
}) 


module.exports = mongoose.model('games', gamesSchema)