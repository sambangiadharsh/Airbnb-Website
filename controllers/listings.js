const listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    curruser=req.user;
    
    const alllistings=await listing.find({});
       
       res.render("./listings/index.ejs",{alllistings});
   }

module.exports.rendernewform=(req,res)=>{
       
    res.render("listings/new.ejs");
    
}
module.exports.showlisting=async(req,res)=>{
       
    curruser=req.user;
    const {id}=req.params;
    const lists=await listing.findById(id).populate({path:"reviews",populate:{
     path:"author",
    },}).populate("owner");
    
    if(!lists){
     req.flash("error","your selected listing is deleted already!");
     res.redirect("/listings");

    }
  
    res.render("listings/show.ejs",{lists});
}

module.exports.createlisting=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
       
    const newlist=new listing(req.body.lists);
    newlist.owner=req.user._id;
    newlist.image={url,filename};
    await newlist.save();
    req.flash("success","new list is created!");
    res.redirect("/listings");

}
module.exports.updatelisting=async(req,res)=>{
    const {id}=req.params;
    let listings =await listing.findByIdAndUpdate(id,{...req.body.lists}); 
   
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url,filename};
        await listings.save();
    }
    req.flash("success","listing is updated!");
    res.redirect(`/listings/${id}`);

}

module.exports.rendereditform=async(req,res)=>{
    const {id}=req.params;
 
    const lists=await listing.findById(id);
    let originalimageurl=lists.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs",{lists,originalimageurl});

}

module.exports.deletelisting=async(req,res)=>{
    const {id}=req.params;
    const deletelist=await listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted!");
    console.log(deletelist);
    res.redirect("/listings");
}