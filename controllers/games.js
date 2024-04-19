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


exports.Evaulatemove = [auth,async (req, res) => {

    try {
        const { user_id, Actualgame, row, column } = req.body;

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const _userId = decodedToken.userId;

        if(user_id === _userId){

            const ongoingGame = await Game.findOne({
              userId: user_id,
              status: true
            });

            if (!ongoingGame) {
              
                return res.json({
                    success: false,
                    error: 'User does not have an existing game!'
                })

            }

            let count = 0;//0 looking in horizontal - 1 looking in vertical
            let sum;
            let pre_sum;
            let validation; 
            let actual_array;
            let indexInit;
            let indexFinal;

            while(count < 2){

                sum = 0;
                pre_sum = 0;
                validation = false;

                for(let i=0; i < Actualgame[0].length;i++){


                    actual_array = (count==0) ? Actualgame[0][row][i] : Actualgame[0][i][column];console.log("actual_array: "+actual_array);

                    if( Array.isArray(actual_array) && sum == 0){

                        sum = (count==0) ? actual_array[1] : actual_array[0];console.log("sum: "+sum);
                        indexInit = i + 1;continue;

                    }else if( sum > 0 &&  ( Array.isArray(actual_array) || i == (Actualgame[0].length - 1) ) ){

                        if( pre_sum <= sum ){//the move was good

                            validation = true;

                        }else{//the move was bad

                            validation = false;

                        }

                        if( Array.isArray(actual_array) ){

                            indexFinal = i - 1;

                        }else{
                            indexFinal = i;
                        }


                    }else if(sum > 0 && !Array.isArray(actual_array) && (typeof actual_array === 'number') ){

                        pre_sum = pre_sum + actual_array;

                    }
                    /////////////
                    if(sum > 0 ){

                    }
                    if(!Array.isArray(actual_array) ){

                    }
                    if( (typeof actual_array === 'number') ){

                    }
                    /////////////
                    console.log("pre_sum: "+pre_sum);
                }
                console.log("validation: "+validation);
                //color error
                let color = (validation == false) ? 'red' : "white";console.log("color: "+color);
                console.log("indexInit: "+indexInit);console.log("indexFinal: "+indexFinal);

                for(let j = indexInit; j <= indexFinal; j++){

                    if(count == 0){//horizontal

                        Actualgame[1][row][j] = color;

                    }else{//vertifacl

                        Actualgame[1][j][row] = color; 
                    }

                }
                //color error                

                count = count +1;

            } 

            res.json({

                success: true,
                game: Actualgame,

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

