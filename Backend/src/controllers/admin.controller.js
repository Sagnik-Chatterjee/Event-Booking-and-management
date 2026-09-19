import {User} from "../models/user.model.js"
import {Event} from "../models/event.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const getNoOfUsersAndEvents= asyncHandler(async(req,res)=>{
    try{
    const users=await User.countDocuments()
    const events=await Event.countDocuments()
    if(!events || !users){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(200).json(new ApiResponse(200,{users:users,events:events},"No of Users and Events returned successfully"))
    }catch(e){
        throw new ApiError(500,e)
    }

})
const getPendingRoutes=asyncHandler(async(req,res)=>{
    try {
        const events=await Event.find({status:"Pending",date:{$gte:new Date()}})
        if (!events){
            throw new ApiError(500,"Something went wrong")
        }
        return res.status(200).json(new ApiResponse(200,{events}))
    } catch (error) {
        throw new ApiError(500,error)
    }
})
const confirmPendingEvent=asyncHandler(async(req,res)=>{
    try{
        const {id}=req.params
        const event=await Event.findByIdAndUpdate(id,{$set:{
            status:"Confirmed"
        }},{new:true})
        if(!event){
            throw new ApiError(400,"Invalid id")
        }
        return res.status(200).json(new ApiResponse(200,event,"Event Confirmed successfully"))
    }catch(e){
        throw new ApiError(500,e)
    }
})
const getExpiredEvents=asyncHandler(async(req,res)=>{
    try {
        const events=await Event.find({date:{$lt:new Date()}})
        if(!events){
            throw new ApiError(500,"Some error occured")
        }
        return res.status(200).json(new ApiResponse(200,events,"Expired events returned successfully"))
    } catch (e) {
        throw new ApiError(500,e)
    }
})
const deletEvents=asyncHandler(async(req,res)=>{
    try {
        const{id}=req.params
        const event=await Event.findByIdAndDelete(id)
        if(!event){
            throw new ApiError(400,"No such event exists")
        }
        return res.status(200).json(new ApiResponse(200,event,"Event Deleted successfully"))
    } catch (error) {
        throw new ApiError(500,error)
    }
})
export {getNoOfUsersAndEvents,getPendingRoutes,confirmPendingEvent,getExpiredEvents,deletEvents}