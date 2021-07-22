const Register = require("../../src/db/models/register");
const User=require("../../src/db/models/register");
const bcrypt=require("bcryptjs");
function detailsRegister(){
    return{
        index(req,res){
            res.render('register');
        },
        async postData(req,res){
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            req.flash('error','All fields are required');
            req.flash('name',name);
            req.flash('email',email);
            return res.redirect("/register");
        }
        // check if email exist or not
        User.exists({email:email},(err,result)=>{
            if(result){
                req.flash('error','Email already present');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect("/redirect");
            }
        })
        // Hash password
        const hashedPassword= await bcrypt.hash(password,10);
        // create user
        const user =new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        // save info in database
        user.save().then((user)=>{
            return res.redirect("/");
        }).catch(err=>{
            req.flash("error","Something went wrong");
            return res.redirect("/register")
        })
        }
    }
}
module.exports=detailsRegister;