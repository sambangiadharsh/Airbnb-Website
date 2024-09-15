
if(process.env.NODE_ENV!="production"){
    require('dotenv').config()

}

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const listing=require("./models/listing.js")
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync.js");
const expresserror=require("./utils/expresserror.js");
const review=require("./models/review.js");
const path=require("path");
const {listingschema,reviewschema}=require("./schema.js");
const listingrouter=require("./routes/list.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const mongostore=require("connect-mongo")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js")
const {isloggedin,isreviewauthor}=require("./middleware.js");
const { deletereview, createreview } = require("./controllers/reviews.js");
const reviewcontroller=require("./controllers/reviews.js")
 
const dburl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("db  is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dburl);
}

app.use(express.urlencoded({extended:true}))
app.engine("ejs",ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


const store = mongostore.create({
    mongoUrl: dburl, // Use 'mongoUrl' instead of 'mongourl'
    crypto: {
        secret:process.env.SECRET, // Secret for encrypting the session
    },
    touchAfter: 24 * 3600, // In seconds, session will only be updated once every 24 hours
});

// Handle errors in the session store
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// Session configuration
const sessionOptions = {
    store, // MongoDB session store
    secret: process.env.SECRET, // Secret for signing the session ID cookie
    resave: false, // Prevent resaving session if it wasn’t modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie max age is 7 days
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
};



app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})


passport.use(new LocalStrategy(user.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
  
app.get("/",(req,res)=>{
    res.redirect("./listings");
    
})


app.use("/listings",listingrouter);
app.use("/",userrouter);




//for review validation

const validatereview=(req,res,next)=>{
    const {error} =reviewschema.validate(req.body.review);
    
    if(error){
        let errmsg=error.details.map((mp)=>mp.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }

}

//review routes
//post review route
app.post("/listings/:id",isloggedin,validatereview,wrapasync(reviewcontroller.createreview))

//delete review route
app.delete("/listings/:id/reviews/:reviewid",isloggedin,isreviewauthor,reviewcontroller.deletereview)

//ERROR HANDLING REQUESTS


app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found!"));
})

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{err});
});


app.listen(8000,()=>{
    console.log("app is listening");
})