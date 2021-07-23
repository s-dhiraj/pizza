const mongoose=require("mongoose");
const menuSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    price:{
        type:Number,
        required:true
    }
})
// creating collection
const Menu=new mongoose.model("Menu",menuSchema);
module.exports=Menu;