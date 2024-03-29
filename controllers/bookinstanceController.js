const BookInstance = require('../models/bookInstance')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')
const Book = require('../models/book')

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
    await BookInstance.findByIdAndDelete(req.params.id).exec()
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
    // const bookinstance = BookInstance.findById(req.params.id).populate('book status').exec()
    // res.render('bookinstance_loan',{
    //     title: 'Loan book',
    //     bookinstance: bookinstance,
    // })
    res.send('not implemented: book copy loan get')
})
exports.bookinstance_loan_post= asyncHandler(async(req,res,next)=>{
    res.send('not implemented: book COPY loan post')
})