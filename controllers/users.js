
const user=require("../models/user")

module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs")
  }


module.exports.signup=async(req,res)=>{
    try{
      let {username,email,password}=req.body;
    const newuser= new user({username,email});
    const registereduser=await user.register(newuser,password);
   
    
    req.login(registereduser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to wanderlust!");
      res.redirect("/listings");
    })
    }
    catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }
  
  }

  module.exports.login=async(req,res)=>{
    console.log('req.user:', req.user);
    curruser=req.user;
  
    req.flash("success","welocome to wanderlust you are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
  }

  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","successfully loggedout!");
    res.redirect("/listings");
    })
    
   }