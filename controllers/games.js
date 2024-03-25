const Game = require('../models/games');
const auth = require('../middlewares/authenticate');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const board = require('./boards');

exports.CreateGame = [auth,async (req, res) => {

    try {
        const { user_id, levelId } = req.body;

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const _userId = decodedToken.userId;

        if(user_id === _userId){

            const ongoingGame = await Game.findOne({
              userId: user_id,
              status: true
            });

            if (ongoingGame) {
              
                return res.json({
                    success: false,
                    error: 'User already has an existing game!',
                    game: ongoingGame.game 
                })

            }

            const oldGame = await Game.deleteOne({
              userId: user_id,
              status: false
            });

            const randomBoard = await board.getBoards(levelId);

            const game = Game({ 
                userId: user_id, 
                boardId: randomBoard._id,
                game: randomBoard.board 
            });

            await game.save();


            res.json({

                success: true,
                game: game,

            });

            

        }else{

            res.json({

                success: false,
                error: "This user is not the owner of the account.",

            });
        }

    } catch (err) {

        res.json({

          success: false,
          error: err.message,
          
        });

    }

}];