import dotenv from "dotenv"
dotenv.config({path:"./.env"})
import { app } from "./src/app.js";
import connectToDb from "./src/config/db.js";

connectToDb()
.then(()=>{
    app.listen(8000,()=>{
        console.log("Server started on Port 8000")
    })
})
.catch((err)=>{
    console.log("Server Connection Failed !!!",err);
})
