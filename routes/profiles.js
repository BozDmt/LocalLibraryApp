const express = require('express')
const router = express.Router()

router.get('/', function(req,res,next){
    res.render('profile',{profi:'This is my first router right there. Your profile is cool!'})
})

module.exports = router