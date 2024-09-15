const review=require("../models/review")
const listing=require("../models/listing")


module.exports.createreview=async(req,res)=>{
    let list=await listing.findById(req.params.id);
    let newreview=new review(req.body.reviews);
    newreview.author=req.user._id;
     console.log(newreview);
    list.reviews.push(newreview);
    await newreview.save();
    await list.save();
    req.flash("success","review is cesated!");
    console.log("review is saved");
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","review is deleted!");
    res.redirect(`/listings/${id}`);
}