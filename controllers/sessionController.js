const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const LibraryMember = require('../models/libmember')

let refreshTokens = []

exports.list = asyncHandler(async(req,res)=>{
    const users = await LibraryMember.find({}).exec()
    res.render('profiles',{users: users})
})

exports.login_get = asyncHandler(async(req,res)=>{
    res.render('login',{title: 'Log in to your account'})
})

exports.user_create_post = [
    asyncHandler(async(req,res,next)=>{
        const hashedPasswd = await bcrypt.hash(req.body.password,10)
        const user = {name: req.body.username, password: hashedPasswd}
        const newUser = new LibraryMember({
            username: user.name,
            password: user.password,
        })
        await newUser.save()
        res.send('User created')
    })
]

exports.login_post = asyncHandler(async (req,res)=>{
    // const username = req.body.username
    const user = {name: req.body.username}

    const accessToken = jwt.sign({username: user},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10s'})
    const refreshToken = jwt.sign({username: user},process.env.REFRESH_TOKEN_SECRET)
    
    refreshTokens.push(refreshToken)

    res.cookie('jwt',accessToken,{httpOnly: true})
    res.cookie('token',refreshToken,{httpOnly: true})
    res.cookie('user',user,{httpOnly: true})

    res.redirect('/catalog')
})

exports.login_logout = asyncHandler(async(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.jwt)
    res.cookies = null  
    res.json(refreshTokens)
})