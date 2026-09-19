import mongoose, { Schema } from "mongoose";

const eventSchema=new mongoose.Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    posterUrl:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    noOfSeatRows:{
        type:Number,
        required:true
    },
    noOfSeatColumns:{
        type:Number,
        required:true
    },
    seatLayout:[],
    status:{
        type:String,
        enum:["Pending","Confirmed"],
        default:"Pending"
    }
},{timestamps:true})

export const Event=mongoose.model("Event",eventSchema)