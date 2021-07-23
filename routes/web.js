const homeControllers = require("../controllers/homeController");
const cart=require("../controllers/cart");
const detailRegister=require("../controllers/auth/detailRegister")
const detailLogin=require('../controllers/auth/detailLogin');
const orderController=require('../controllers/orderController');
//middlewares
const auth=require('../controllers/middlewares/auth');
const admin=require("../controllers/middlewares/admin");
const guest=require("../controllers/middlewares/guest");
const AdminorderController=require('../controllers/admin/orderController');
const statusController = require("../controllers/admin/statusController");
function initRoutes(app){
    app.get("/",homeControllers().index)

     app.get("/register",guest,detailRegister().index)

     app.post("/register",detailRegister().postData);

    app.get("/login",guest,detailLogin().index)

    app.post("/login",detailLogin().postLogin);

    app.post("/logout",detailLogin().logout);

     app.get("/cart",cart().index);

     app.post("/update-cart",cart().update);
     // orders routes
     app.post("/orders",auth,orderController().store);

     app.get("/orders",auth,orderController().index); 

     app.get("/customer/orders/:id",auth,orderController().show);

     // admin routes
     app.get("/admin/order",admin,AdminorderController().index)

     app.post("/admin/order/status",admin,statusController().update);

}
module.exports=initRoutes;