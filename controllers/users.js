const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const auth = require('../middlewares/authenticate');

const bcrypt = require('bcrypt');



exports.createUser = async(req, res) => {

    try{

        const _active = true;
        const _type = 1;



        const {

            email,
            username,
            fname,
            lname,
            password

        } = req.body;   
        

        const findUsername = await Users.findOne({username})

        if(findUsername){ 
              return res.json({
                  success: false,
                  error: 'Username already exists',
              })
           }

        const findEmail = await Users.findOne({email})

        if(findEmail){ 
              return res.json({
                  success: false,
                  error: 'Email already exists, please login',
              })
          }

        

        const user = Users({

            email,
            username,
            fname,
            lname,
            password,

        });

        try {
              // Save the user data
              await user.save();

              const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {

                expiresIn: '1d',

              });

              res.json({

                success: true,
                user: user,
                token

              });
             

              
        } catch (validationError) {

          
          return res.json({

            success: false,
            error: 'Validation error',

          });

        } 
        
    }catch(error){
        res.json({
          success: false,
          error: "Server error "+error,
        });
    }
}


exports.userLogIn = async (req, res)=> {

  try {

        const {username , password} = req.body;

        const user = await Users.findOne({username})
        
        if(!user){ 
            return res.json({
                success: false,
                error: 'Username does not exist',
            })
        }
        

        const isMatch = await user.comparePassword(password);

        if(!isMatch) return res.json({
            success: false,
            error: 'Incorrect password or username',
        })

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        res.json({
            success: true,
            user: user,
            token
        })
  } catch (error) {

        res.status(500).send('Server error')

  }

}

