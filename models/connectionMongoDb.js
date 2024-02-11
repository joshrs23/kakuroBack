const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{

        console.log('CuppidConect Database is connected');

    })
    .catch(
        err => console.log(err.message)
    );