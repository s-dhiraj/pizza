const mongoose=require('mongoose');
const connection=mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pizza",{
    useNewUrlParser: true, 
        
    useUnifiedTopology: true,
    useCreateIndex:true,

    }).then(()=> console.log("connection successful...."))
    .catch(()=> console.log("connection unsucessful.........."))

  require("./models/menu");

  module.exports=connection

