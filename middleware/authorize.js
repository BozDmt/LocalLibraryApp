import * as jwt from 'jsonwebtoken'

function verifyToken(req,res,next){

    // const username = req.cookies.user
    //noo, not like that! Decode the jwt and extract the id 
    // const token = req.cookies.token? req.cookies.token: null
    const token = jwt.decode(req.cookies.jwt,{complete: true})
    const userId = token.id
    // if(!token) 
    //     return res.redirect('/login')
    // else
    //     jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,function(err){
    //         if(err)
    //             res.send('No token')
    //     })
    
    // const newAccessToken = jwt.sign({username: username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10s'})
    // res.cookie('jwt',newAccessToken,{httpOnly: true, sameSite: 'strict'})
    
    next()
    
}

export {verifyToken as authzMw}