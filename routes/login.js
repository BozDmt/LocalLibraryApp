// import { config } from 'dotenv' 
import express from 'express'
const router =  express.Router()
import * as sessionController from '../controllers/sessionController.js'

// const authenticate = require('../middleware/authenticate')
import {authzMw} from '../middleware/authorize.js'

router.get('/',sessionController.login_get)
router.post('/',sessionController.login_post)

export {router as loginRouter}
//NOTE: when creating routes, always put the ones with a querystring last, otherwise the router will try to read the URL
//and attempt to interpret variables from it