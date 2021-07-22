const passport = require("passport");

function detailLogin(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/order' : '/'
    }
    return{
        index(req,res){
            res.render('login');
        },
        postLogin(req,res,next){
            const { email, password }   = req.body
            // Validate request 
             if(!email || !password) {
                 req.flash('error', 'All fields are required')
                 return res.redirect('/login')
             }

            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err);
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect("/login")
                }
                req.login(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req,res,next)

        },
        logout(req,res){
            req.logout()
            // console.log("log");
               return res.redirect('/login') 

        }
    }
}
module.exports=detailLogin;