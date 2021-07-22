const mongoose=require("mongoose");
 const Register=require("./register")
const orderSchema=new mongoose.Schema({
  customerId:{
      type:mongoose.Schema.Types.ObjectId, // bascially we are making relation of order collection with user collection
      ref:'Register', // with which collection we want to connect
      required:true
  },
  items:{
      type:Object,
      required:true
  },
  phone:{
      type:String,
      required:true
  },
  address:{
      type:String,
      required:true
  },
  paymentType:{
      type:String,
      default:'COD'
  },
  status:{
      type:String,
      default:'order-placed'
  }
},{timestamps:true})
const Order=new mongoose.model("Order",orderSchema);
module.exports=Order;