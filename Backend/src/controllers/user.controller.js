import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken= async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser= asyncHandler(async(req,res)=>{
    const {fullName,email,password}=req.body
    if([fullName,email,password].some((e)=> e?.trim() ==="")){
    throw new ApiError(400, "All fields are required")
}
const existedUser=await User.findOne({email})
if(existedUser){
    throw new ApiError(409,"User with email or usernaame already exists")
}
const user= await User.create({
    fullName,
    email,
    password,
})

const a=await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!a){
    throw new ApiError(500,"Something went wrong while registering a user")
}

return res.status(201).json(
    new ApiResponse(200,a,"User registered successfully")
)
})

const loginUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;

    if(!email || !email.trim()){
        throw new ApiError(400,"Email required")
    }

    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordvalid= await user.isPasswordCorrect(password)
    if(!isPasswordvalid){
        throw new ApiError(401, "Password incorrect")
    }

    const{accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24*60*60*1000
    }

    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken,{httpOnly:true, secure:true,sameSite: "none", maxAge:10*24*60*60*1000}).json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken},"User logged in successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options={
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24*60*60*1000
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
        
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken", refreshToken, {httpOnly:true, secure:true,sameSite:"none" ,maxAge: 10*24*60*60*1000}).json(
            new ApiResponse(200,{accessToken, refreshToken: refreshToken},"Access token refreshed successfully")
        )
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid refresh token")
    }
})

export {loginUser,registerUser,refreshAccessToken};
