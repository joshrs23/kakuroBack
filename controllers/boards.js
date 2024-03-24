const Board = require('../models/boards');

exports.getBoards  = async(levelId) => {

    try {

        const board = await Board.find({ levelId: levelId });

        if (board.length === 0) {

            return null;
        }

        const randomIndex = Math.floor(Math.random() * board.length);

        return board[randomIndex];

    } catch (err) {

        res.json({
            success: false,
            error: err.message ,
        });

    }
    
}
