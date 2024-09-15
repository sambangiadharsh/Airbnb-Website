const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const multer=require("multer");
const {storage}=require("../cloudCongif.js")
const upload=multer({storage})

const listing=require("../models/listing")
const {isloggedin,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js")


//router.route

router.route("/")
.get(wrapasync(listingcontroller.index))
.post(isloggedin,upload.single('lists[image]'),validatelisting,
   wrapasync(listingcontroller.createlisting));

//new route
router.get("/new",isloggedin,listingcontroller.rendernewform)
   
router.route("/:id")
.get(wrapasync(listingcontroller.showlisting))
.put(isloggedin,isowner,upload.single('lists[image]'),validatelisting,wrapasync(listingcontroller.updatelisting))
.delete(isloggedin,isowner,wrapasync(listingcontroller.deletelisting))

   //edit route
   router.get("/:id/edit",isloggedin,isowner,wrapasync(listingcontroller.rendereditform))

   
   module.exports=router;