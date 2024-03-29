require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const router =  express.Router()
const sessionController = require('../controllers/sessionController')

router.get('/',sessionController.login_get)
router.post('/',sessionController.login_post)
router.get('/users',authenticateToken,sessionController.list)

function authenticateToken(req,res,next){
    const token = req.cookies.jwt.split(' ')[1]
    console.log(token)
    if(!token) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}
module.exports = router