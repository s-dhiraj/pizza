const Menu=require("../src/db/models/menu");
function homeControllers(){
    return {
       async index(req,res){
        const pizza=await Menu.find()
        res.render('home',{ pizza:pizza});
    }
    }
}
module.exports=homeControllers;