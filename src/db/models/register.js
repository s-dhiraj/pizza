const mongoose=require("mongoose");
const customerSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
     type:String,
     default:'customer'
    }
},{timestamps:true})

const Register=new mongoose.model("Register",customerSchema);
module.exports=Register;
