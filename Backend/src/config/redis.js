import Redis from "ioredis";

const redis=new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    retryStrategy: ()=> 5000
})

redis.on("error",(err)=>{
    console.error("Redis error: ",err)
})

redis.on("connect",()=>{
    console.log("Redis connected successfully")
})

export default redis

