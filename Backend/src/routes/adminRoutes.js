import { Router } from "express";
import { verifyAdmin } from "../middlewares/authorization.middleware.js";
import { confirmPendingEvent, getNoOfUsersAndEvents,getPendingRoutes,getExpiredEvents,deletEvents} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
const router=Router();
router.use(verifyJWT)
router.use(verifyAdmin)
router.get("/",getNoOfUsersAndEvents)
router.get("/pending",getPendingRoutes)
router.put("/confirm/:id",confirmPendingEvent)
router.get("/expired",getExpiredEvents)
router.delete("/delete/:id",deletEvents)
export default router
