const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const LibraryMember = require('../models/libmember')


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

exports.login_post = (req,res)=>{
    // const username = req.body.username
    const user = {name: req.body.username}

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)

    res.cookie('jwt',accessToken,{httpOnly: true, maxAge: 24*60*60*1000})

    res.redirect('/login/users')
}