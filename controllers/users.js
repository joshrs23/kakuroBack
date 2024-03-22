const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const auth = require('../middlewares/authenticate');
const API_KEY_MAILGUM = process.env.API_KEY_MAILGUM; 
const DOMAIN_MAILGUM = process.env.DOMAIN_MAILGUM; 
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


exports.userEmail = async (req, res)=> {

  try {

        const {email } = req.body;

        const user = await Users.findOne({email})
        
        if(!user){ 
            return res.json({
                success: false,
                error: 'Username does not exist',
            })
        }

        const formData = require('form-data');
        const Mailgun = require('mailgun.js');
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({username: 'api', key: API_KEY_MAILGUM || 'key-yourkeyhere'});

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {

            expiresIn: '1d',

        });

        var link = `http://localhost:3000/recover/${token}`;

        mg.messages.create(DOMAIN_MAILGUM, {
            from: "Excited User <joshrs23@gmail.com>",
            to: ["joshrs23@gmail.com"],
            subject: "Kakuro game",
            text: "Esto es una prueba de envío de correo electrónico utilizando Mailgun.",
            html: `<h1>Hi ${user.fname}, from Kakuro Game</h1><p>If you want to change your password, please click the following link.</p><a href='${link}' target='_blank'>Change password</a>`
        })
        .then(msg => {

            //console.log(msg)
            res.json({
                success: true,
                msg : 'Email sended!'
            })

        }) // logs response data
        .catch(err => {

            //console.log(err) 
            return res.json({
                success: false,
                error: err,
            })

        }); // logs any error

  } catch (error) {

        res.status(500).send('Server error : '+ error.message)

  }

}

exports.recoveryUserLink = [auth,async (req, res)=> {

  try {

        const { password } = req.body; 

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        if(userId){

            const recoverySuccess = await processUserRecovery(userId,password);
            res.json({ success: recoverySuccess.success, message: recoverySuccess.msg });

        }else{

          return res.json({
                success: false,
                error: 'Error problem with the validation of the token!',
          })

        }

  } catch (error) {

        res.status(500).send('Server error : '+ error.message)

  }

}];

exports.recoveryUserWeb= [auth,async (req, res)=> {

  try {

        const { userId,password } = req.body; 

        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const _userId = decodedToken.userId;

        if(userId === _userId){

            const recoverySuccess = await processUserRecovery(userId,password);
            res.json({ success: recoverySuccess.success, message: recoverySuccess.msg });

        }else{

            res.json({

                success: false,
                error: "This user is not the owner of the account.",

            });
        }

    } catch (error) {

        res.status(500).send('Server error : '+ error.message)

    }

}];

const processUserRecovery = async (userId, _password) => {

  try {
        const user = await Users.findById(userId)
        
        if(!user){ 

            return {
                success: false,
                msg: 'User not found.',
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 9);

        const result = await Users.updateOne({ _id: userId }, { $push: { password: hashedPassword  } });

        if (result.nModified === 1) {

            return {
                success: true,
                msg : 'Password was updated!'
            };

        } else {
          
          return {
                success: false,
                msg: 'Error updating password, try again!',
          };

        }

    } catch (error) {

        return { success: false, msg: 'Server error: ' + error.message };

    }

};


