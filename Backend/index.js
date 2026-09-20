import dotenv from "dotenv"
dotenv.config({path:"./.env"})
import { app } from "./src/app.js";
import connectToDb from "./src/config/db.js";
import "./src/config/redis.js"
import http from 'http'
import { Server } from "socket.io";

connectToDb()
.then(()=>{
    const httpServer=http.createServer(app)

    const io=new Server(httpServer,{
        cors:{
            origin:"*",
            methods:["GET","POST"],
            credentials:true
        }
    })

    io.on("connection",(socket)=>{
        console.log("A user connected: ",socket.id)
    })

    httpServer.listen(8000,()=>{
        console.log("Server started on Port 8000")
    })
})
.catch((err)=>{
    console.log("Server Connection Failed !!!",err);
})
