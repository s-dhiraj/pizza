const mongoose=require('mongoose');
const connection=mongoose.connect(process.env.MONGO_CONNECTION,{
    useNewUrlParser: true, 
        
    useUnifiedTopology: true,
    useCreateIndex:true,

    }).then(()=> console.log("connection successful...."))
    .catch(()=> console.log("connection unsucessful.........."))

  require("./models/menu");

  module.exports=connection

