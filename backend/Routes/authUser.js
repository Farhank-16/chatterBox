import express from 'express'
import { userLogOut, userLogin, userRegister } from '../routeControllers/userRouteControllers.js';


const router = express .Router();

router.post('/register',userRegister)

router.post('/login',userLogin)

router.post('/logout',userLogOut)



export default router;