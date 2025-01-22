import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.get('/users', protectRoute, getUsersForSideBar);
router.get('/:id', protectRoute, getMessages);
router.post('/:id', protectRoute, sendMessage);

export default router;