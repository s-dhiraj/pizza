const Order=require('../src/db/models/order');
const moment=require('moment');
function orderController(){
    return {
        store(req,res){
          // validate request
          const{phone,address}=req.body;
          if(!phone || !address){
              req.flash('error','All fields are mandatory');
              return res.redirect('/cart');
          }
          const order= new Order({
              customerId : req.user._id, // passport provide logged in user on req.user
              items:req.session.cart.items,
              phone:phone,
              address:address
            })

            order.save().then(result=>{
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                req.flash('sucess','order placed sucessfully');
                delete req.session.cart; // for deleting cart(we can delete any object in js like this)
                 // Emit
                 const eventEmitter = req.app.get('eventEmitter')
                 eventEmitter.emit('orderPlaced', placedOrder)
                return res.redirect("/orders");

            })
        }).catch(err=>{
            req.flash('error','Something went wrong');
            return res.redirect("/cart");
        })
        },
        async index(req,res){
           try{
            const orders=await Order.find({customerId:req.user._id},null,{sort:{'createdAt':-1}});
            res.render('order',{orders:orders,moment:moment});
           }
          catch(err){
            return  res.redirect('/')
          }
        },

        async show(req, res) {
           try{
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('singleOrder', { order })
            }
           }
            catch(err){
                return  res.redirect('/')
            }
        }
    }
}
module.exports=orderController;