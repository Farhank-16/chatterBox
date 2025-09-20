import express from 'express'
import { getMessages, sendMessage, deleteMessage } from '../routeControllers/messageRouteControllers.js'
import isLogin from '../middleware/isLogin.js'

const router = express.Router()

router.post('/send/:id', isLogin, sendMessage)
router.get('/:id', isLogin, getMessages)
router.delete('/:id', isLogin, deleteMessage)   

export default router 
