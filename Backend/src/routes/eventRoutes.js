import {upload} from "../middlewares/multer.middleware.js"
import { Router } from "express";
import { getEventsByCity,addEvent,getEventById } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";

const router=Router()
router.use(verifyJWT)
router.get("/:city",getEventsByCity)
router.post("/",upload.single("posterImage"),addEvent)
router.get("/event/:id",getEventById)
export default router


