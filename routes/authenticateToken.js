//access token for login, refresh token for browsing in site
const jwt = require('jsonwebtoken')

const tokens = []

exports.refreshAccessToken = function(req,res,next){
    const accessToken = req.cookies.jwt? req.cookies.jwt: null
    if(!accessToken) return res.sendStatus(401)
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET,(err)=>{
        if(err){
            console.log(accessToken)
            //return res.sendStatus(403)//auth of access token here is useless
        }
        // next()
    })
    const token = req.cookies.token? req.cookies.token: null
    if(!token) return res.sendStatus(401)
    const user = req.cookies.user.name
    //store the refresh tokens in the database and do a search if the current one is in there
    //perform checks to see if the refresh token is in the database
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err)=>{
        // console.log(user)
        if(err){
                return res.sendStatus(401)
        }
        const newAccessToken = jwt.sign({username: user},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10s'})
        res.cookie('jwt',newAccessToken,{httpOnly: true, sameSite: true})
        next()
    })
}