const listing=require("./models/listing");
const review=require("./models/review");
const expresserror=require("./utils/expresserror.js");
const {listingschema}=require("./schema.js");
module.exports.isloggedin=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in for creating listing");
     return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isowner=async(req,res,next)=>{
    const {id}=req.params;
    let list=await listing.findById(id);
       if(curruser && !list.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not allowed to edit htis listing!");
        return res.redirect(`/listings/${id}`);
       }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    const {error} =listingschema.validate(req.body);
    
    if(error){
        let errmsg=error.details.map((mp)=>mp.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }

}


module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let rev=await review.findById(reviewid);
       if(!rev.author.equals(res.locals.curruser._id)){
        req.flash("error","you did not author of this review!");
        return res.redirect(`/listings/${id}`);
       }
    next();
}