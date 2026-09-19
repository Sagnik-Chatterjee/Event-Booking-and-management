import mongoose from "mongoose";

const connectToDb=async()=>{
    try{
        const connection=await mongoose.connect("mongodb://localhost:27017/booking");
        console.log("MongoDb Connected")
    }catch(error){
        console.log("Mongodb Connection error",error)
        process.exit(1)
    }
}

export default connectToDb;