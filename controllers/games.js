const Game = require('../models/games');
const auth = require('../middlewares/authenticate');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const board = require('./boards');
const history = require('../models/histories');

exports.StartGame = [auth,async (req, res) => {

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
                    game: ongoingGame.game, 
                    time: ongoingGame.time,
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


exports.Evaluatemove = [auth,async (req, res) => {

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
            let valGeneral = true;
            let arrayRept;
            let quantity;

            while(count < 2){

                sum = 0;
                pre_sum = 0;
                validation = false;
                arrayRept = [];
                quantity = 0;

                for(let i=0; i < Actualgame[0].length;i++){


                    actual_array = (count==0) ? Actualgame[0][row][i] : Actualgame[0][i][column];


                    if( Array.isArray(actual_array) && sum == 0){

                        sum = (count==0) ? actual_array[1] : actual_array[0];
                        indexInit = i + 1;
                        continue;

                    }

                    if(sum > 0 && !Array.isArray(actual_array) && (typeof Number(actual_array) === 'number') && !isNaN(Number(actual_array))){

                        pre_sum = pre_sum + Number(actual_array);
                        arrayRept.push(actual_array);

                    }

                    if( !Array.isArray(actual_array) &&  actual_array!="black"){
                        quantity = quantity +1;//for the validation of completed but sum is less
                    }
                    
                    if( sum > 0 &&  ( Array.isArray(actual_array) || i == (Actualgame[0].length - 1) ) ){

                        if( pre_sum <= sum ){//the move was good

                            if(pre_sum < sum && arrayRept.length == quantity){//validation for that maybe the sum is ok but they complete all the cell and the sum is less than the result

                                validation = false;
                                valGeneral = false;

                            }else{

                                validation = true;

                            }

                        }else{//the move was bad

                            validation = false;
                            valGeneral = false;

                        }

                        if( Array.isArray(actual_array) ){

                            indexFinal = i - 1;

                        }else{
                            indexFinal = i;
                        }


                    }

                    
                }

                //validate repetition
                if(validation == true){

                    let uniqueElements = new Set(arrayRept);

                    if(uniqueElements.size !== arrayRept.length){
                        validation = false;
                        valGeneral = false;
                    }

                }
                //validate repetition

                //color error
                let color = (validation == false) ? 'red' : "white";
                
                for(let j = indexInit; j <= indexFinal; j++){
                    
                    if(count == 0){//horizontal
                        
                        Actualgame[1][row][j] = color;
                        
                    }else{//vertical
                        
                        if(valGeneral == false && Actualgame[1][j][column] == "red"){

                            continue;

                        }else{
                            
                            Actualgame[1][j][column] = color; 
                        }
                        
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

exports.QuitGame = [auth,async (req, res) => {

    try {
        const { user_id } = req.body;

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
                    error: 'User already has not an existing game!',
                    game: null 
                })

            }

            const result = await Game.updateOne({ userId: user_id }, { $set: { status: false  } });

            if (result.modifiedCount === 1) {

                return res.json({
                    success: true,
                    msg : ''
                });

            } else {
              
                return res.json({
                    success: false,
                    msg: 'Error stoping the game, try again!',
                });

            }

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

exports.SaveGame = [auth,async (req, res) => {

    try {
        const { user_id, Actualgame } = req.body;

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
                    error: 'User already has not an existing game!',
                    game: null 
                })

            }

            if( JSON.stringify(ongoingGame.game) === JSON.stringify(Actualgame) ){

                return res.json({
                    success: true,
                    msg : ''
                });

            }

            const result = await Game.updateOne({ userId: user_id }, { $set: { game: Actualgame  } });

            if (result.modifiedCount === 1) {

                return res.json({
                    success: true,
                    msg : ''
                });

            } else {
              
                return res.json({
                    success: false,
                    msg: 'Error saving the game, try again!',
                });

            }

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


/*
exports.validateGame = [auth,async (req, res) => {

    try {
        const { user_id, Actualgame, level } = req.body;

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
                    error: 'User already has not an existing game!',
                    game: null 
                })

            }

            //validate colors
            const colorArray = Actualgame[1];
            let validation = true;

            for (let row of colorArray) {
                
                for (let color of row) {
                    
                    if (color === 'red') {

                        validation = false;
                        break;

                    }
                }

                if (validation === false) {

                    break;

                }
            }
            //validate colors

            //validate numbers
            const numbersArray = Actualgame[0];

            if(validation == true){

                for (let row of numbersArray) {
                    
                    for (let color of row) {
                        
                        if (color === 'white') {

                            validation = false;
                            break;

                        }
                    }

                    if (validation === false) {

                        break;

                    }
                }
            }
            //validate numbres

            if(validation == true){

                //diference on date
                const givenDate = new Date(ongoingGame.time);
                const now = new Date();
                const differenceInMilliseconds = now.getTime() - givenDate.getTime();
                const differenceInSeconds = (differenceInMilliseconds / 1000)/60;
                //diference on date

                //aca sacar el dia con hora, sacar la diferencia y agregar al history
                const hist = history({ 
                    userId: user_id, 
                    level: level,
                    time: differenceInSeconds
                });

                await hist.save();

                const result = await Game.updateOne({ userId: user_id }, { $set: { status: false  } });

                if (result.modifiedCount === 1) {

                    return res.json({
                        success: true,
                        msg : 'Congratulations, you finished the game!'
                    });

                } else {
                  
                    return res.json({
                        success: false,
                        msg: 'Error finishing the game, try again!',
                    });

                }

            }else{

                return res.json({
                    success: false,
                    msg: 'Error you still have mistakes, try again, try again!',
                });

            }
                

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
*/

exports.validateGame = [auth,async (req, res) => {

    try {
        const { user_id, Actualgame, level } = req.body;

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
                    error: 'User already has not an existing game!',
                    game: null 
                })

            }

            // Validate colors
            const colorArray = Actualgame[1];
            let valid = true;

            // Validación horizontal
            for (let row = 0; row < Actualgame[0].length; row++) {
                let sum = 0;
                let pre_sum = 0;
                let arrayRept = [];
                let quantity = 0;

                for (let column = 0; column < Actualgame[0][row].length; column++) {
                    const cell = Actualgame[0][row][column];

                    if (Array.isArray(cell) && sum === 0) {
                        sum = cell[1];
                        continue;
                    }

                    if (sum > 0 && !Array.isArray(cell) && !isNaN(Number(cell))) {
                        pre_sum += Number(cell);
                        arrayRept.push(cell);
                    }

                    if (!Array.isArray(cell) && cell !== "black") {
                        quantity++;
                    }

                    if (sum > 0 && (Array.isArray(cell) || column === Actualgame[0][row].length - 1)) {
                        if (pre_sum !== sum || (pre_sum < sum && arrayRept.length === quantity)) {
                            valid = false;
                        }

                        // Validar repetición de números en la misma suma
                        const uniqueElements = new Set(arrayRept);
                        if (uniqueElements.size !== arrayRept.length) {
                            valid = false;
                        }

                        sum = 0;
                        pre_sum = 0;
                        arrayRept = [];
                        quantity = 0;
                    }
                }
            }

            // Validación vertical
            for (let column = 0; column < Actualgame[0][0].length; column++) {
                let sum = 0;
                let pre_sum = 0;
                let arrayRept = [];
                let quantity = 0;

                for (let row = 0; row < Actualgame[0].length; row++) {
                    const cell = Actualgame[0][row][column];

                    if (Array.isArray(cell) && sum === 0) {
                        sum = cell[0];
                        continue;
                    }

                    if (sum > 0 && !Array.isArray(cell) && !isNaN(Number(cell))) {
                        pre_sum += Number(cell);
                        arrayRept.push(cell);
                    }

                    if (!Array.isArray(cell) && cell !== "black") {
                        quantity++;
                    }

                    if (sum > 0 && (Array.isArray(cell) || row === Actualgame[0].length - 1)) {
                        if (pre_sum !== sum || (pre_sum < sum && arrayRept.length === quantity)) {
                            valid = false;
                        }

                        // Validar repetición de números en la misma suma
                        const uniqueElements = new Set(arrayRept);
                        if (uniqueElements.size !== arrayRept.length) {
                            valid = false;
                        }

                        sum = 0;
                        pre_sum = 0;
                        arrayRept = [];
                        quantity = 0;
                    }
                }
            }

            if(valid  == true){

                //diference on date
                const givenDate = new Date(ongoingGame.time);
                const now = new Date();
                const differenceInMilliseconds = now.getTime() - givenDate.getTime();
                const differenceInSeconds = (differenceInMilliseconds / 1000)/60;
                //diference on date

                //aca sacar el dia con hora, sacar la diferencia y agregar al history
                const hist = history({ 
                    userId: user_id, 
                    level: level,
                    time: differenceInSeconds
                });

                await hist.save();

                const result = await Game.updateOne({ userId: user_id }, { $set: { status: false  } });

                if (result.modifiedCount === 1) {

                    return res.json({
                        success: true,
                        msg : 'Congratulations, you finished the game!'
                    });

                } else {
                  
                    return res.json({
                        success: false,
                        msg: 'Error finishing the game, try again!',
                    });

                }

            }else{

                return res.json({
                    success: false,
                    msg: 'Error you still have mistakes, try again, try again!',
                });

            }
                

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