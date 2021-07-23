function auth(req,res,next){
    // passport provides method to check whether user is loggedin or not with req.isAuthenticated()
    if(req.isAuthenticated()){
        return next();
    }
   return  res.redirect("/login");
}
module.exports=auth;