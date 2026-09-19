import express from "express"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js"
import eventRouter from "./routes/eventRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
const app=express();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.get("/",(req,res)=>{
    return res.json({message:"Hello World"})
})
app.use("/user",userRouter)
app.use("/events",eventRouter)
app.use("/admin",adminRouter)

export {app};