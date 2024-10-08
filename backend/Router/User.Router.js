import { Router } from "express";
import {register, login, logout, getProfile} from '../Controller/User.controller.js'
const router = Router();


router.post('/register', register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me',getProfile)

export default router;