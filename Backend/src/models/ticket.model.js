import mongoose, { Schema } from "mongoose";
const ticketSchema=new mongoose.Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    event:{
        type:Schema.Types.ObjectId,
        ref:"Events"
    },
    noOfSeats:{
        type:Number,
        required:true
    },
    seats:[]
},{timestamps:true})

export const Ticket=mongoose.model("Ticket",ticketSchema)