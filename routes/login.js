require('dotenv').config()
const express = require('express')
const router =  express.Router()
const sessionController = require('../controllers/sessionController')
const authenticateJWT = require('./authenticateToken')

router.get('/',sessionController.login_get)
router.post('/',sessionController.login_post)
router.get('/user',authenticateJWT.refreshAccessToken,sessionController.list)
router.get('/logout',sessionController.login_logout)

module.exports = router