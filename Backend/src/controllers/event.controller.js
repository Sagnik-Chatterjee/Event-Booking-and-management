import mongoose from "mongoose";
import { Event} from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";
import Razorpay from "razorpay";

const generateSeatLayout = (rows, columns, seats = []) => {
    const seatLayout = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        const rowName = String.fromCharCode(65 + i);

        for (let j = 1; j <= columns; j++) {
            const seatNumber = `${rowName}${j}`;

            row.push({
                seatNumber,
                status: seats.includes(seatNumber) ? "Booked" : "Available"
            });
        }

        seatLayout.push(row);
    }

    return seatLayout;
};
const getEventsByCity=asyncHandler(async(req,res)=>{
    const {city}=req.params
    const events = await Event.find({
  city: { $regex: city, $options: "i" },
  status: "Confirmed",
  date: { $gt: new Date() }
}).populate({
  path: "owner",
  select: "-password -refreshToken"
});
    return res.status(200).json(new ApiResponse(200,events))
})

const addEvent=asyncHandler(async(req,res)=>{
    console.log(req.body)
    const{title,description,duration,price,date,venue,city,noOfSeatRows,noOfSeatColumns}=req.body
    const seatLayout=generateSeatLayout(noOfSeatRows,noOfSeatColumns)
    if([title,description,duration,price,date,venue,city,noOfSeatRows,noOfSeatColumns].some((e)=> e?.trim() ==="")){
    throw new ApiError(400, "All fields are required")
}
const posterLocalPath=req.file?.path
    if(!posterLocalPath){
        throw new ApiError(400,"Poster file is missing")
    }
    const posterUrl=await uploadCloudinary(posterLocalPath)

    if(!posterUrl){
        throw new ApiError(400,"Error while uploading on poster")
    }
    const event=await Event.create({
        title,description,duration,price,date,venue,city,noOfSeatRows,noOfSeatColumns,seatLayout,posterUrl:posterUrl.url,owner:req.user._id
    })
    if(!event){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(200).json(new ApiResponse(200,event))
})
const getEventById=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const event=await Event.find({_id:new mongoose.Types.ObjectId(id),status:"Confirmed"}).populate({path: "owner",select: "-password -refreshToken"});
    if(!event){
        throw new ApiError(400,"Event does not exist")
    }
    if(event.date<new Date()){
        throw new ApiError(401,"Event has expired")
    }
    return res.status(200).json(new ApiResponse(200,event))
})

const checkout=asyncHandler(async(req,res)=>{
    const {RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY}=process.env
    const razorpayInstance={key_id:RAZORPAY_ID_KEY, key_secret:RAZORPAY_SECRET_KEY}
    const{amount,seats}=req.body
    const{id}=req.params
    const user_id=req.user._id
    const user= await User.findById(user_id)
    const options={amount:amount, currency:'INR', receipt:user.email}
    razorpayInstance.orders.create(options,async(err,order)=>{
        if(!err){
            const seatLayout = generateSeatLayout(rows, columns, seats);

            const updatedEvent = await Event.findByIdAndUpdate(id,
                {
                    $set: {
                        seatLayout: seatLayout
                    }
                },
                { new: true }
            );
            const ticket=await Ticket.create({owner:user_id,event:id,noOfSeats:seats.length,seats:seats})
            if(!ticket){
                throw new ApiError(500,"Something went wrong")
            }
            return res.status(200).json(new ApiResponse(200,"Ticket booked"))
        }else{
            throw new ApiError(400,"Payment failed")
        }
    })
})



export {getEventsByCity,addEvent,getEventById,checkout}