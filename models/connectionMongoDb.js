const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{

        console.log('Kakuro Database is connected');

    })
    .catch(
        err => console.log(err.message)
    );