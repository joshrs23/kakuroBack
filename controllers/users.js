const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const auth = require('../middlewares/authenticate');

const bcrypt = require('bcrypt');
const Matches = require('../models/matches');


exports.createUser = async(req, res) => {

    try{

        const _active = true;
        const _type = 1;

        const {

            email,
            _username,
            _fname,
            _lname,
            _password,
            country,
            province,
            city,
            _address,
            _dob

        } = req.body;      

        const user = Users({

            email,
            _username,
            _fname,
            _lname,
            _password,
            country,
            province,
            city,
            _address,
            _dob,
            _type,
            _active

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

          if (validationError.errors && validationError.errors._email) {
            
            return res.json({

              success: false,
              error: 'Email already exists',

            });

          }
          
          return res.json({

            success: false,
            error: 'Validation error',

          });

        } 
        
    }catch(error){
        res.json({
          success: false,
          error: "Error en el servidor "+error,
        });
    }
}


exports.userSignIn = async (req, res)=> {

    const {_email , _password} = req.body;

    const user = await Users.findOne({_email})
    
    if(!user){ 
        return res.json({
            success: false,
            error: 'User is not registered.',
        })
    }
    if(!user._active){
        return res.json({
            success: false,
            error: 'User is not active.',
        })
    }

    const isMatch = await user.comparePassword(_password);

    if(!isMatch) return res.json({
        success: false,
        error: 'Incorrect password.',
    })

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    res.json({
        success: true,
        user: user,
        token
    })
}

