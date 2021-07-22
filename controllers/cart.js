const session = require("express-session");

function cart(){
    return{
        index(req,res){
            res.render('cart');
        },
        update(req,res){
        //    let cart={
        //        items:{
        //            pizzaId:{ item:pizzaObject,qty:0}
        //        },
        //        totalQty:0,
        //        totalPrice:0
        //    }

            // first time creating cart
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            let cart=req.session.cart;
            //console.log(cart);
            //console.log(req.body);
          // console.log(session.cart)
            // check if item does not exist in cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                }
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice=cart.totalPrice+req.body.price;
            }
            else{
                cart.items[req.body._id].qty=cart.items[req.body._id].qty +1;
                cart.totalQty=cart.totalQty+1 
                cart.totalPrice=cart.totalPrice+req.body.price
            }
           return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}

module.exports=cart;