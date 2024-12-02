import * as jwt from 'jsonwebtoken'
// const {body, validationResult} = require('express-validator')
import * as bcrypt from 'bcrypt'
import User from '../models/user.js'

function authentication (req,res,next){

//     const user = await User.findOne({username:req.body.username}).exec()
//     const cookieOptions = {httpOnly: true, sameSite: 'strict'}

//     if(!user){
//         const errors = [{msg:'Incorrect username or password'}]
//         res.render('login',{title: 'Log in to your account', errors: errors})
//         return
//     }else{
//         const same = await bcrypt.compare(req.body.password,user.password)
//         if(!same){
//             const errors = [{msg:'Incorrect username or password'}]
//             res.render('login',{title: 'Log in to your account', errors: errors})
//             return
//         } 
//         const accessToken = jwt.sign({username: user.username, url: user.url, id: user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10h'})
//         const refreshToken = jwt.sign({username: user.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn: '10h'})
        
// //        res.cookie('user',user.username,cookieOptions)
//         res.cookie('token',refreshToken,cookieOptions)
//         res.cookie('jwt',accessToken)
        
//         next()
//     }
    // refreshTokens.push(refreshToken)

    // res.sendStatus(200)
    next()
}

export {authentication as authMw}
