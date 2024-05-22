const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// exports.verifyToken = (req,res,next)=>{
//     let token = req.headers['x-access-token']

//     if(!token){
//         res.redirect('/login')
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err)=>{
//         if(err){
//             res.redirect('/login')
//         }
//         next()
//     })
// }
exports.verifyToken = asyncHandler(async (req,res,next)=>{
    const username = req.cookies.user
    
    const token = req.cookies.token? req.cookies.token: null
        
    if(!token) 
        return res.redirect('/login')
    else
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,function(err){
            if(err)
                res.send('No token')
        })
    
    const newAccessToken = jwt.sign({username: username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10s'})
    res.cookie('jwt',newAccessToken,{httpOnly: true, sameSite: 'strict'})
    
    next()
    
})