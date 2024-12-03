import express from 'express'
const router = express.Router()
import * as sessionController from '../controllers/sessionController.js'

router.get('/',/*authorize.verifyToken,*/sessionController.user_details)
router.get('/logout',sessionController.logout)
router.get('/create',sessionController.user_create_get)
router.post('/create',sessionController.user_create_post)
router.get('/delete',sessionController.user_delete_get)
router.post('/delete',sessionController.user_delete_post)
router.get('/settings',sessionController.user_settings)

export {router as usersRouter}