import { Socket,Server } from "socket.io";
import redis from "../config/redis";

export const registerSocketHandler= (socket:Socket, io:Server)=>{
    /**
     * USER JOINS A SHOW ROOM
     * When a user opens the seat layout page, we send all currently locked seats.
     */
    socket.on("join-event",async({eventId})=>{
        //Join the room using event id
        socket.join(eventId);
        socket.data.eventId= eventId
        console.log(`Socket ${socket.id} joined ${eventId}`)
        /**
         * Fetch all locked seats from Redis set
         */
        const lockedSeats= await redis.smembers(`locked-seats:${eventId}`)

        const activeLockedSeats=[]
        for(const seatId of lockedSeats){
            const lockKey=`seat-lock:${eventId}:${seatId}`
            const exists=await redis.exists(lockKey)

            if(exists){
                activeLockedSeats.push(seatId)
            }else{
                await redis.srem(`locked-seats:${eventId}`,seatId)
            }
        }
        //Send locked seats to all users present in this show room
        socket.emit('locked-seats-initials',{seatIds:activeLockedSeats})
    })

    /**
     * LOCK SEATS
     * Whenever User clicks "Proceed" we lock seats for 5 minutes
     */
    socket.on("lock-seats",async({eventId,seatIds,userId})=>{
        if(!seatIds || !eventId || !userId){
            return;
        }
        const lockedSeatsKeys:string=`locked-seats:${eventId}`
        const unavailableSeats: string[]=[]
        //Step1: Check if seats are already locked
        for(const seatId of seatIds){
            const seatLockKey=`seat-lock:${eventId}:${seatId}`
            const existingLock=await redis.get(seatLockKey)
            if(existingLock){
                unavailableSeats.push(seatId)
            }
        }
        //If any seats already locked reject request
        if(unavailableSeats.length>0){
            socket.emit("seat-lock-failed",{
                eventId,requested:seatIds, alreadyLocked:unavailableSeats
            })
            return
        }
        //Lock all seats
        for(const seatId of seatIds){
            const seatLockKey=`seat-lock:${eventId}:${seatId}`
            //Store seat lock with TTL=5min
            await redis.setex(seatLockKey,30,userId)
            //Add seat to locked seats Set
            await redis.sadd(lockedSeatsKeys,seatId)
        }
        //Broadcast seat lock to everyone in the show
        io.to(eventId).emit("seat-locked",{
            eventId,
            seatIds,
            userId
        })
    })

    //Unlock Seats
    socket.on("unlock-seats",async({eventId,seatIds,userId})=>{
        if(!seatIds || !eventId || !userId){
            return;
        }
        const lockedSeatsKey=`locked-seats:${eventId}`
        for(const seatId of seatIds){
            const seatLockKey=`seat-lock:${eventId}:${seatId}`
            //remove individual seat lock
            await redis.del(seatLockKey)
            //remove seat from locked Set
            await redis.srem(lockedSeatsKey,seatId)

            io.to(eventId).emit("seat-unlocked",{
                eventId,
                seatIds,
                userId
            })
            console.log(`${userId} unlocked seats: `,seatIds)
        }
    })

    /**
     * SOCKET DISCONNECT
     * We don't manually unlock seats here
     * Redis TTL will automatically release them after 5 minutes
     */
    socket.on('disconnect',()=>{
        const eventId=socket.data.eventId
        console.log(`Socket ${socket.id} disconnected from event ${eventId}`)
    })
}