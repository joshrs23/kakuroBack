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
        
        const mg = mailgun({apiKey: '****', domain: '*****'});

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        const data = {
          from: 'Excited User <joshrs23@gmail.com>', // Cambia a tu dirección de correo verificada en Mailgun
          to: 'joshrs23@gmail.com', // La dirección de correo del destinatario
          subject: 'Hola desde Mailgun',
          text: 'Esto es una prueba de envío de correo electrónico utilizando Mailgun.',
          html: '<h1>Hola desde Mailgun</h1><p>Esto es una prueba de envío de correo electrónico utilizando Mailgun.</p>'
        };

        
        

        mg.messages().send(data, function (error, body) {
          console.log(body);
          if (error) {

            return res.json({
                success: false,
                error: error,
            })

          }
          else{

                res.json({
                success: true,
                user: user,
                token
            })

          }
        });

  } catch (error) {

        res.status(500).send('Server error')

  }

}



