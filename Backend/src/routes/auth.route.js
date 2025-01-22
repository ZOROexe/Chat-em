import express from "express"
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post('/signup', signup); 
router.post('/login', login);
router.get('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);

export default router;