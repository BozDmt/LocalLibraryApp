require('dotenv').config()
const express = require('express')
const router =  express.Router()
const sessionController = require('../controllers/sessionController')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/',sessionController.login_get)
router.post('/',authenticate.login_post,sessionController.login_post)
router.get('/user',authorize.verifyToken,sessionController.list)
router.get('/logout',sessionController.login_logout)
router.get('/user/create',sessionController.user_create_get)
router.post('/user/create',sessionController.user_create_post)
router.get('/user/update')
router.get('/user/:id',sessionController.login_user_details)

module.exports = router
