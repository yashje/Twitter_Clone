import express from "express"
const router = express.Router()
import { getNotifications, deleteNotifications, deleteNotification } from "../controllers/notification.controller.js"
import protectRoute from "../middleware/protectRoute.js"


router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications)
router.delete("/:id", protectRoute, deleteNotification)

export default router;