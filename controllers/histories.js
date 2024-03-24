const History = require('../models/histories');
const auth = require('../middlewares/authenticate');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');

exports.getHistories  = [auth,async(req, res)=>{

    try {
        const { level } = req.body;

        const histories = await History.find({ level: level }).sort({ time: 1 }).limit(10);

        if (!histories) {

            res.json({

                success: false,
                histories: null,

            });

        } else {

            res.json({

                success: true,
                histories: histories,

            });

        }


    } catch (err) {

        res.json({

          success: false,
          error: err.message,
          
        });

    }

}];

exports.getHistoryUser = [auth,async (req, res) => {

    try {
        const { user_id } = req.body;

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const _userId = decodedToken.userId;

        if(user_id === _userId){

            const histories = await History.find({ userId: user_id }).sort({ time: 1 });

            if (!histories) {

                res.json({

                    success: false,
                    histories: null,

                });

            } else {

                res.json({

                    success: true,
                    histories: histories,

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
  
exports.addHistoryUser = [auth,async (req, res) => {

    try {
        const { user_id, level, time } = req.body;

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const _userId = decodedToken.userId;

        if(user_id === _userId){

            const history = History({ 
                userId: user_id, 
                level: level,
                time:time 
            });

            await history.save();


            res.json({

                success: true,
                history: history,

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
  