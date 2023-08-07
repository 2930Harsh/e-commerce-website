const monogoose = require('mongoose');

const connectDatabase = ()=>{
    monogoose.connect(process.env.DB_URI , {
        // userNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
}

module.exports = connectDatabase;