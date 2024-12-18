import BookInstance from'../models/bookInstance.js'
import paginate from'express-paginate'
import {body, validationResult} from'express-validator'
import Book from'../models/book.js'
import User from'../models/user.js'
import jwt from'jsonwebtoken'
import mongoose from 'mongoose'

// import book from'../models/book.js'

export function bookInstance_list (req,res,next){
    Promise.all([BookInstance.find()
    .populate('book')
    .skip(req.query.skip)
    .limit(req.query.limit)
    .exec(),
    BookInstance.countDocuments({},null)
    ])
    .then((data)=>{
        const [allBookinstances, bookCount] = data
        
        const pageCount = Math.ceil(bookCount / req.query.limit)
    
        res.render('bookinstance_list',{
            title: 'List of book copies',
            bookinstance_list: allBookinstances,
            pageCount:pageCount,
            pages: paginate.getArrayPages(req)(req.query.limit,pageCount,req.query.page)
        })
    })
}

export function bookInstance_detail (req,res,next){
    BookInstance
    .findById(req.params.id)
    .populate('book')
    .exec()
    .then((bookinstance)=>{
        res.render('bookinstance_details', {
            bookinstance: bookinstance,
        })
    })

}

export function bookInstance_create_get (req, res, next){
    Book
    .find({}, "title")
    .sort({ title: 1 })
    .exec() 
    .then((allBooks)=>{
        res.render("bookinstance_form",{
            title: 'Create a copy',
            book_list: allBooks,
            statuses: ['Maintenance', 'Available', 'Loaned', 'Reserved'],
        })
    })
  
}
  

export const bookInstance_create_post = [
    body('book','Book must be specified')
    .trim()
    ,
    body('imprint','Book imprint must be specified')
    .trim()
    .blacklist('<>')
    ,
    body('status','Please specify a status')
    .escape(),
    body('due_back','Invalid Date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),

    (req,res,next)=>{
        const errors = validationResult(req)

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
        })

        if(!errors.isEmpty()){
            Book
            .find({},'title')
            .sort({title: 1})
            .exec()
            .then((allBooks)=>{
                
                res.render('bookinstance_form',{
                    title: 'Create a copy',
                    book_list: allBooks, 
                    selected_book: bookInstance.book._id,
                    bookinstance: bookInstance,
                    statuses: ['Maintenance', 'Available', 'Loaned', 'Reserved'],
                    errors: errors.array(),
                })
            })
        }
        else{
            bookInstance.save().then(()=>{res.redirect(bookInstance.url)})
        }
    },
    

]

export function bookInstance_delete_get (req,res){
    BookInstance
    .findById(req.params.id)
    .populate('book')
    .exec()
    .then((copy)=>{

        if(copy.status==='Loaned'){
            res.render('redirect')
        }
        else{
            res.render('bookinstance_delete',{
                bookinstance: copy,
            })
        }
    })

}

export function bookInstance_delete_post (req,res){
        
    BookInstance
    .findByIdAndDelete(req.params.id)
    .exec()
    .then(()=>{
        res.redirect('/catalog/bookinstances')
    })
    .catch((e)=>{
        console.error(e)
    })
    
}

export function bookInstance_update_get (req,res,next){
    BookInstance
    .findById(req.params.id)
    .populate('book')
    .exec()
    .then((bookCopy)=>{
        res.render('bookinstance_form',{
            title:`Update copy of ${bookCopy.book.title}`,
            bookinstance: bookCopy,
            statuses: ['Maintenance','Available'],
        })
    })
}

export const bookInstance_update_post = [ 
    body('imprint','Imprint must be provided')
    .trim()
    .blacklist('<>')
    .isLength({min: 1}),
    body('due_back','Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),
    body('status','Please select a status'),
    
    (req,res)=>{
        const errors = validationResult(req)
        
        if(!(req.body.due_back instanceof Date) && req.body.status === 'Maintenance'){
            const d = new Date()
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDay()
            const available_date = new Date(year,month,day)
            req.body.due_back = available_date
        }

        if (!errors.isEmpty()){
            BookInstance
            .findById(req.params.id)
            .populate('book')
            .exec()
            .then((bookCopy)=>{
                res.render('bookinstance_form',{
                    title:`Update copy of ${bookCopy.book.title}`,
                    bookinstance: bookCopy,
                    statuses: ['Maintenance','Available'],
                    errors: errors.array(),
                })
            })
        }
        else{
            BookInstance.findByIdAndUpdate(req.params.id,{
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,
            })
            .then(()=>{
                res.redirect('/catalog/bookinstances')
            })
        }
    }
]

export function bookinstance_loan_get (req,res,next){
    BookInstance
    .findById(req.params.id)
    .populate('book')
    .exec()
    .then((bookinstance)=>{
        res.render('bookinstance_loan',{book_instance: bookinstance})
    })

}

export const bookinstance_loan_post = [
    (req,res,next)=>{
        const token = jwt.decode(req.cookies.jwt)

        const threeMonths = Date.now() + 5184000000
        Promise.all([
            BookInstance.
            findByIdAndUpdate(req.params.id,{
                status: 'Loaned',
                due_back: threeMonths,
            }),
            User
            .findById(token.uid)
        ])
        .then(([bookinstance,theUser])=>{
            theUser.books_loaned.push(bookinstance._id)
            return [bookinstance, theUser]
        })
        .then(([bookinstance,theUser])=>{
            return User.findByIdAndUpdate(token.uid,{books_loaned: theUser.books_loaned},{})
            .then(()=>
                bookinstance
            )//.catch(e=>{})
        })
        .then((bookinstance)=>{
            res.redirect(bookinstance.url)
        }).catch(e=>{
            console.error(e)
            res.redirect('/catalog/bookinstances')
        })
        
        // const returnDate = DateTime.fromMillis(today).toLocaleString(DateTime.DATE_MED)
        // res.send(returnDate)
        
}]

export function bookinstance_return_get (req,res){
    res.render('bookinstance_return')
}

export const bookinstance_return_post = [
    (req,res)=>{
        const user = jwt.decode(req.cookies.jwt,process.env.ACCESS_TOKEN_SECRET)
        
        const book_id = new mongoose.Types.ObjectId(`${req.params.id}`)
        console.log(book_id)
        Promise.all([
            User.findByIdAndUpdate({_id: user.uid},{$pull:{books_loaned: book_id}}).exec(),
            BookInstance.findByIdAndUpdate(req.params.id,{status: 'Available'}).exec()
        ]).then(([user,userBooks])=>{            
            const userBooksLoaned = []
            console.log(userBooks)
            Array.prototype.forEach.call(userBooks,(book)=>{
                userBooksLoaned.push(book)
            })
            console.log('THE BOOKS LOANED ARE:')
            console.log(...userBooksLoaned)
            // for(const book of userBooks){
            //     for(const record of book['books_loaned']){
            //        if(record != req.params.id) 
            //         userBooksLoaned.push(record)
            //     }
            // }
            return [user,userBooksLoaned]
        }).then(([userdata,loaned])=>{
            User.findByIdAndUpdate(userdata._id,{books_loaned:loaned}).exec()
        }).then(()=>{
            res.redirect('/catalog')
        })
    }
]