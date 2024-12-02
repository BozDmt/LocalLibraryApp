import express from 'express'
const router = express.Router()
import * as sessionController from '../controllers/sessionController.js'

router.get('/',/*authorize.verifyToken,*/sessionController.list)
router.get('/logout',sessionController.logout)
router.get('/create',sessionController.user_create_get)
router.post('/create',sessionController.user_create_post)
router.get('/update')
router.get('/delete',sessionController.user_delete_get)
router.post('/delete',sessionController.user_delete_post)
router.get('/:id',sessionController.list)
//                       ^
//user_details goes here |. Is it even necessary to have the id in the url if it can be stored in the jwt?

export {router as usersRouter}