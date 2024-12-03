import jwt from 'jsonwebtoken'
import {body, validationResult} from 'express-validator'
import User from '../models/user.js'
import BookInstance from'../models/bookInstance.js'
import Token from '../models/tokens.js'

const cookieOptions = {httpOnly: true, sameSite: 'strict'}

export function list(req,res){
    //this is useless, when you log in there will be the jwt which holds your username and/or id, so you will be 
    //able to access your profile page
    // User.findOne({username: req.body.username, role: req.body.role})
    res.render('profile',{users: null})
}

export function user_create_get(req,res,next){
    res.render('user_form')
}

export function login_get(req,res){
    req.cookies.jwt? res.redirect('/catalog') : res.render('login',{title: 'Log in to your account'})
}

export const login_post = [
    body('username')
    .blacklist('<>'),
    (req,res)=>{    
        req.cookies.jwt
        ? res.redirect('/catalog') 

        : User.findOne({
            username: req.body.username
        },{username: 1, role: 1, password: 1})
        .then((user)=>{
            if(!user){
                res.render('login',{errors:{msg:'Invalid username or password. Try again.'}})
                return
            }
            // if(user.loggedIn === 1)    ERROR OUT
            return user.comparePasswd(req.body.password)
                .then((match)=>{
                    return {uid: user._id, role: user.role, match}
                })
            
            
        }).then((data)=>{
            if(data.match){
                const accessToken = jwt.sign(
                    {uid: data.uid.toString(), role: data.role},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'10s'}
                )
                const refreshToken = jwt.sign(
                    {uid: data.uid.toString(), role: data.role},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn:'10m'}
                )
                //jwt.decode(token,{complete: true})
                // res.setHeader('Authorization',`Bearer ${accessToken}`)
                const dbToken = new Token({token: refreshToken, uid:data.uid.toString(), role: data.role})
                dbToken.save()
                //or just store iat inside the tokens to be able to link them
                //when making a website with role management, checking the user's privileges is done upon every request
                //where authorization is needed. So if the session is done by using jsonwebtoken, the user's role will
                //be stored on that jwt which will then be read by the controller which in turn checks if that user is
                //permitted access to that page.
                res.cookie('jwt',accessToken,cookieOptions)
                // req.user = JSON.stringify({uid: data.uid, role: data.role})
                // console.log(`the request object with the user data presumably: ${req.user}`)
                res.redirect('/catalog')
                
            }
            res.render('login',{errors: {msg: 'Invalid username or password. Try again.'}})
        })
        .catch((e)=>{
            // res.render('login',{errors: 'User not found'})
            console.log(`catch block message: ${e.message}`)
        })
}]

export const user_create_post = [
    //escape the password and username later  
    body('username')
    .blacklist('<>'),
    
    (req,res,next)=>{
        const errors = validationResult(req)
        
        if(errors.isEmpty()){

            // localStorage.setItem('role',user.role)
            User.findOne({
                username: req.body.username,
                role: req.body.role
            })
            .then((exists)=>{
                if(!exists){
                    const newUser = new User({
                        username: req.body.username,
                        password: req.body.password,
                        role: req.body.role
                    })
                         
                    return newUser.save()
                }
                res.render('user_form',{errors: {msg:'User exists'}})
            })
            .then((savedUser)=>{
                // res.cookie('id',`${savedUser._id}`,cookieOptions)
                // res.cookie('role',`${savedUser.role}`,cookieOptions)        
                res.redirect(`/login`)
                
            }).catch((e)=>console.error(e.message))
        }
        else{
            res.send(errors.array())
        }
    }
]

export function logout(req,res){
    const accessToken = jwt.decode(req.cookies.jwt)
    Token.findOneAndDelete({uid: accessToken.uid})
    .then(()=>{
        res.clearCookie('jwt')
        res.redirect('/catalog')
    }).catch((e)=>{
        console.error(e)
    })
}

export function user_details (req,res,next){//this isn't implemented yet; 
    const token = jwt.decode(req.cookies.jwt)

    User.findById(token.uid).exec()
    .then((user)=>{
        return Promise.all([
            user,
            BookInstance.find({_id: { $in: user.books_loaned}})
            .populate('book')
            .exec()
            .then(books=>books)
        ])
    }).then(([user,books])=>{
        res.render('profile',{user:user,loanedBooks: books? books:null})
        res.end()
    })
}

export function user_delete_get (req,res,next){
    res.render('user_delete_form')
}

export const user_delete_post = [
    body('username')
    .blacklist('<>'),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.render('user_delete_form',{errors: errors})
            return
        }
        User.findOne({
            username: req.body.username
        },{username: 1, _id:1 ,password: 1, role:1})
        .then((user)=>{
            if(!user){
                res.render('user_delete_form',{errors: 'Incorrect input. Check fields and try again.'})
                return
            }
            return user.comparePasswd(req.body.password)
                .then((matched)=>{
                    return {userId: user._id, match: matched}
                })
        })
        .then((data)=>{
            const userstr = data.userId.toString().replace('6','7')
            console.log(userstr)
            
            if(data.match){
                return User.findById(userstr)
                    .then((details)=>{
                        if(details)
                            console.log(details)
                        else console.log('user not found walter')
                    })
                // res.redirect('/catalog')
            }
            else console.log('again, hey there: ' + data.match)
                // console.log(match)
                // User.findByIdAndDelete(data.userId).exec()
        })
    }
]

export function get_user (req,res){
    const token = jwt.decode(req.cookies.jwt)
    if(!token){
        const results = JSON.stringify({'role':'-1'})
        res.send(results)
    }

    const destructured = JSON.stringify(token.role)
    res.send(destructured)
    // res.send(null)
}

export function user_settings(req,res){
    res.render('user_settings')
}