const express=require("express");
const router=express.Router();
const user=require("../models/user.js")
const wrapasync=require("../utils/wrapasync.js")
const passport=require("passport");
const {saveRedirectUrl} =require("../middleware.js")
const usercontroller=require("../controllers/users.js")

//router.route
router.route("/signup")
.get(usercontroller.rendersignupform)
.post(wrapasync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.login)



router.get("/logout",usercontroller.logout)

module.exports=router;