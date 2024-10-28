const jwt = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const BookInstance = require('../models/bookInstance')

let refreshTokens = []

exports.list = asyncHandler(async(req,res)=>{
    // const users = await LibraryMember.find({}).exec()
    //this is useless, when you log in there will be the jwt which holds your username and/or id, so you will be 
    //able to access your profile page
    res.render('profile',{users: null})
})

exports.user_create_get = (req,res,next)=>{
    res.render('user_form')
}

exports.login_get = (req,res)=>{
    res.render('login',{title: 'Log in to your account'})
}

exports.login_post = (req,res)=>{    
    
    res.redirect('/catalog')
}

exports.user_create_post = [
    //escape the password and username later  
    body('username')
    .blacklist('<>'),

    (req,res,next)=>{
        const errors = validationResult(req)

        bcrypt.hash(req.body.password,10)
        .then((hashedPasswd)=>{

            const {username, passwd, role} = [req.body.username, hashedPasswd, req.body.role]
            // localStorage.setItem('role',user.role)
            const newUser = new User({
                username: username,
                password: passwd,
                role: role
            })
            if(errors.isEmpty()){
                newUser.save()
                
                const cookieOptions = {httpOnly: true, sameSite: 'strict'}
                
                User.findOne({
                    name: username,
                    password: hashedPasswd,
                    role: role
                }).then((user)=>{
                    res.cookie('id',`${user._id}`,cookieOptions)
                    res.cookie('role',`${user.role}`,cookieOptions)        
                    res.redirect(`/login/user/${user._id}`)
                    // res.end()
                })
            }
        })
    }
]

exports.login_logout = asyncHandler(async(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.jwt)
    res.cookies = null  
    res.json(refreshTokens)
})

exports.login_user_details = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id).exec()

    const loanedBooks = []
   for(bookInstance of user.books_loaned){
       loanedBooks.push(String(bookInstance))
   }
    
    const books = await BookInstance.find({_id: { $in: loanedBooks}}).populate('book').exec()
    res.render('user_details',{user:user,loanedBooks: books? books:null})
})

