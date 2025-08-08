import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsers, sendMessage, readMessageByUser } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

router.patch("/read-by-user/:senderId", protectRoute, readMessageByUser);

export default router;
