const jwt = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const BookInstance = require('../models/bookInstance')

let refreshTokens = []

exports.list = asyncHandler(async(req,res)=>{
    // const users = await LibraryMember.find({}).exec()
    res.render('profiles',{users: null})
})

exports.user_create_get = asyncHandler(async(req,res,next)=>{
    res.render('user_form')
})

exports.login_get = asyncHandler(async(req,res)=>{
    res.render('login',{title: 'Log in to your account'})
})

exports.login_post = asyncHandler(async (req,res)=>{
    res.redirect('/catalog')

})

exports.user_create_post = [
    //escape the password and username later  
    // const username = req.body.username
    body('username')
    .blacklist('<>'),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)

        const hashedPasswd = await bcrypt.hash(req.body.password,10)

        const user = {name: req.body.username, password: hashedPasswd}
        
        const newUser = new User({
            username: user.name,
            password: user.password,
        })
        if(errors.isEmpty()){
            await newUser.save()
            
            res.redirect(`/login/user/${newUser._id}`)
        }
    })
]

exports.login_logout = asyncHandler(async(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.jwt)
    res.cookies = null  
    res.json(refreshTokens)
})

exports.login_user_details = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id).exec()
    for(bok of user.books_loaned)
        console.log(String(bok))
   const loanedBooks = []
   for(bookInstance of user.books_loaned){
       loanedBooks.push(String(bookInstance))
   }
    console.log(loanedBooks)
    const books = await BookInstance.find({_id: { $in: loanedBooks}}).populate('book').exec()
    res.render('user_details',{username:user.username,loanedBooks: books})
})

