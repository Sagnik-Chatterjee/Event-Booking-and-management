import { Event} from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const generateSeatLayout = (rows, columns) => {
    const seatLayout = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        const rowName = String.fromCharCode(65 + i);

        for (let j = 1; j <= columns; j++) {
            row.push({
                seatNumber: `${rowName}${j}`,
                status: "Available"
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
    const event=await Event.findById(id).populate({path: "owner",select: "-password -refreshToken"});
    if(!event){
        throw new ApiError(400,"Event does not exist")
    }
    if(event.date<new Date()){
        throw new ApiError(401,"Event has expired")
    }
    return res.status(200).json(new ApiResponse(200,event))
})



export {getEventsByCity,addEvent,getEventById}