const BookInstance = require('../models/bookInstance')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')
const Book = require('../models/book')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const book = require('../models/book')
exports.bookInstance_list = asyncHandler(async(req,res,next)=>{
    const allBookinstances = await BookInstance.find()
    .populate('book').exec()
    
    res.render('bookinstance_list',{
        title: 'List of book copies',
        bookinstance_list: allBookinstances,
    })
})

exports.bookInstance_detail = asyncHandler(async(req,res,next)=>{
    const bookinstance = await BookInstance.findById(req.params.id).populate('book').exec()

    res.render('bookinstance_details', {
        bookinstance: bookinstance,
    })
})

exports.bookInstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec() 
  
    res.render("bookinstance_form",{
        title: 'Create a copy',
        book_list: allBooks,
        statuses: ['Maintenance', 'Available', 'Loaned', 'Reserved'],
    })
});
  

exports.bookInstance_create_post = [
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

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
        })


        console.log(bookInstance)
        if(!errors.isEmpty()){
            const allBooks = await Book.find({},'title').sort({title: 1}).exec()

            res.render('bookinstance_form',{
                title: 'Create a copy',
                book_list: allBooks, 
                selected_book: bookInstance.book._id,
                bookinstance: bookInstance,
                statuses: ['Maintenance', 'Available', 'Loaned', 'Reserved'],
                errors: errors.array(),
            })
            return
        }
        else{
            await bookInstance.save()
            res.redirect(bookInstance.url)
        }
    }),
    

]

exports.bookInstance_delete_get = asyncHandler(async(req,res)=>{
    const copy = await BookInstance.findById(req.params.id).populate('book').exec()

    if(copy.status==='Loaned'){
        res.render('redirect')
    }
    else{
        res.render('bookinstance_delete',{
            bookinstance: copy,
        })
    }
})

exports.bookInstance_delete_post = asyncHandler(async(req,res)=>{
    try {
        await BookInstance.findByIdAndDelete(req.params.id).exec()
    } catch (error) {
        console.error(error)                
    }
    res.redirect('/catalog/bookinstances')
})

exports.bookInstance_update_get = asyncHandler(async(req,res,next)=>{
    const bookCopy = await BookInstance.findById(req.params.id).populate('book').exec()
    res.render('bookinstance_form',{
        title:`Update copy of ${bookCopy.book.title}`,
        bookinstance: bookCopy,
        statuses: ['Maintenance','Available'],
    })
})

exports.bookInstance_update_post =[ 
    body('imprint','Imprint must be provided')
    .trim()
    .blacklist('<>')
    .isLength({min: 1}),
    body('due_back','Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),
    body('status','Please select a status'),
    
    asyncHandler(async(req,res)=>{
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
            const bookCopy = await BookInstance.findById(req.params.id).populate('book').exec()
            
            res.render('bookinstance_form',{
                title:`Update copy of ${bookCopy.book.title}`,
                bookinstance: bookCopy,
                statuses: ['Maintenance','Available'],
                errors: errors.array(),
            })
            return
        }
        else{
            await BookInstance.findByIdAndUpdate(req.params.id,{
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,
            })
            res.redirect('/catalog/bookinstances')
        }
    })
]

exports.bookinstance_loan_get = asyncHandler(async(req,res,next)=>{
    const bookinstance = await BookInstance.findById(req.params.id).populate('book').exec()

    res.render('bookinstance_loan',{book_instance: bookinstance})
})

exports.bookinstance_loan_post = [
    asyncHandler(async(req,res,next)=>{
        const token = jwt.decode(req.cookies.jwt,process.env.ACCESS_TOKEN_SECRET)
        console.log(token)
        const threeMonths = Date.now() + 7776000000
        const bookinstance = await BookInstance.
        findByIdAndUpdate(req.params.id,{
            status: 'Loaned',
            due_back: threeMonths,
        })
        const theUser = await User.findById(token.id)
        theUser.books_loaned.push(bookinstance._id)
        console.log(theUser)
        const updatedUser = await User.findByIdAndUpdate(token.id,{books_loaned: theUser.books_loaned},{})
        res.redirect(bookinstance.url)
        // const returnDate = DateTime.fromMillis(today).toLocaleString(DateTime.DATE_MED)
        // res.send(returnDate)
        
})]

exports.bookinstance_return_get = asyncHandler(async(req,res)=>{
    res.render('bookinstance_return')
})

exports.bookinstance_return_post = [
    asyncHandler(async(req,res)=>{
        const user = jwt.decode(req.cookies.jwt,process.env.ACCESS_TOKEN_SECRET)
        
        const userBooks = await User.find({_id: user.id},{books_loaned:1,_id: 0}).exec()
        const bookInstance = await BookInstance.findByIdAndUpdate(req.params.id,{status: 'Available'}).exec()

        const userBooksLoaned = []
        for(const book of userBooks){
            for(const record of book['books_loaned']){
               if(record != req.params.id) 
                userBooksLoaned.push(record)
            }
        }
        
        const newUser = await User.findByIdAndUpdate(user.id,{books_loaned:userBooksLoaned}).exec()
        console.log(newUser)
        res.redirect('/catalog')
    })
]