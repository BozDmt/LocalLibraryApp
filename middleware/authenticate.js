const jwt = require('jsonwebtoken')
// const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/user')
//implement the catalog redirection 
exports.login_post = asyncHandler(async (req,res,next)=>{

    const user = await User.findOne({username:req.body.username}).exec()
    const cookieOptions = {httpOnly: true, sameSite: 'strict'}

    if(!user){
        const errors = [{msg:'Incorrect username or password'}]
        res.render('login',{title: 'Log in to your account', errors: errors})
        return
    }else{
        const same = await bcrypt.compare(req.body.password,user.password)
        if(!same){
            const errors = [{msg:'Incorrect username or password'}]
            res.render('login',{title: 'Log in to your account', errors: errors})
            return
        } 
        const accessToken = jwt.sign({username: user.username, url: user.url, id: user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10h'})
        const refreshToken = jwt.sign({username: user.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn: '10h'})
        
//        res.cookie('user',user.username,cookieOptions)
        res.cookie('token',refreshToken,cookieOptions)
        res.cookie('jwt',accessToken)
        
        next()
    }
    // refreshTokens.push(refreshToken)

    // res.sendStatus(200)
    // next()
})
