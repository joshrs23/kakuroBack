const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
require('dotenv').config();
require('./models/connectionMongoDb');

const app = express();

const userRouter = require('./routes/users');
const levelRouter = require('./routes/levels');
const historyRouter = require('./routes/histories');
const gameRouter = require('./routes/games');

//app.use(cors());
// Configuración de CORS
const corsOptions = {
  origin: '*', // Reemplaza con el origen de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});


//user
app.use('/sign-in',express.json());
app.use('/registration',express.json());
app.use('/email-password',express.json());
app.use('/recover-l-password',express.json());
app.use('/recover-password',express.json());

//histories
app.use('/get-records',express.json());
app.use('/get-user-history',express.json());
app.use('/add-history',express.json());

//games
app.use('/create-game',express.json());
app.use('/evaluate-move',express.json());
app.use('/stop-game',express.json());
app.use('/save-game',express.json());
app.use('/validate-game',express.json());

//routes
app.use(userRouter);
app.use(levelRouter);
app.use(historyRouter);
app.use(gameRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).send('Something broke!'); // Send a generic error response
});
// end Error handling middleware

const options = {
  key: fs.readFileSync('/home/nebula/server.key'),
  cert: fs.readFileSync('/home/nebula/server.crt')
};

const server = https.createServer(options, app);



const port = 8000;


server.listen(port, () => {
  console.log(`Server HTTPS is listening to the port ${port}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});

