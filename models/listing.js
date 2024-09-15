 const mongoose=require("mongoose");
 const Schema=mongoose.Schema;
 const review=require("./review.js");

 const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String
        },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review"

 }] ,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    
 });

 listingSchema.post("findOneAndDelete",async(lists)=>{
    if(lists){
        await review.deleteMany({_id:{$in:lists.reviews}});


    }
   
 });

 const  listing=mongoose.model("listing",listingSchema);
 module.exports=listing;