import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
const verifyAdmin=asyncHandler(async(req,res,next)=>{
    const user=req.user
    if(user.role==='ADMIN'){
        next();
    }else{
        throw new ApiError(401, "Unauthorized request")
    }
})
export {verifyAdmin}