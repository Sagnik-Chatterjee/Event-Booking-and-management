import {upload} from "../middlewares/multer.middleware.js"
import { Router } from "express";
import { getEventsByCity,addEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";

const router=Router()
router.use(verifyJWT)
router.get("/:city",getEventsByCity)
router.post("/",upload.single("posterImage"),addEvent)

export default router


