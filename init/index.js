const mongoose=require("mongoose");
const initdata=require("./data");
const listing=require("../models/listing");


 
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("db  is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(mongo_url);
}


const initdb=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"66d5920a0bd13cb711da4e0c"}));
    await listing.insertMany(initdata.data);
    console.log("intitdata inserted");
}

initdb();