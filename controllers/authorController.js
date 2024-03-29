const Author = require('../models/author')
const Book = require('../models/book')
const Genre = require('../models/genre')
const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function(req,file,cb){ 
        cb(null,'public/authorPics')
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({storage: storage})

exports.author_list = asyncHandler(async(req,res,next)=>{
    const allAuthors = await Author.find().sort({last_name: 1}).exec()

    res.render('author_list', {title: 'Author List', author_list: allAuthors})
})

exports.author_detail = asyncHandler(async(req,res,next)=>{
    const [author, bookList] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}).populate('genre').exec(),
    ])

    const genres = []
    
    bookList.forEach((book)=>{
        if(book.genre.length > 0){
            for(val of book.genre){
                genres.push(val.name)
            }
        }            
    })

    console.log(genres)
    const genreList = await Genre.find({name: {$in: genres}}).exec()

    if(author === null){
        const err = new Error('Author not found')
        err.status = 404
        return next(err)
    }

    res.render('author_details',{author: author, books: bookList, genres: genreList})
})

exports.author_create_get = asyncHandler(async(req,res,next)=>{
    res.render('author_form',{title: 'Create Author'})
})

exports.author_create_post = [
    body('first_name')
    .trim()
    .isLength({min: 2})
    .escape()
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('Name shouldn`t contain non-alphanumeric characters'),
    body('last_name')
    .trim()
    .isLength({min: 2})
    .withMessage('Surname must be specified')
    .isAlphanumeric()
    .withMessage('Name shouldn`t contain non-alphanumeric characters'),
    body('date_of_birth','Invalid date')
    .isISO8601()
    .toDate(),
    body('date_of_death','Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),

    upload.single('author_photo'),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)

        const author = new Author({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            photo: req.file? '/authorPics' + path.basename(req.file.path):'/authorPics/default_profile_pic',
        })

        if(!errors.isEmpty()){
            res.render('author_form',{
                title: 'Create Author',
                author: author,
                errors: errors,
            })            
            return
        }
        else{
            const authorExists = await Author.findOne({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }).exec()
            
            if(authorExists){
                res.redirect(authorExists.url)
            }
            else{
                await author.save()
                res.redirect(author.url)
            }
        }
    })
]

exports.author_delete_get = asyncHandler(async(req,res,next)=>{
    const [author, authorBooks] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ])

    if(author === null){
        res.redirect('/catalog/authors')
    }

    res.render('author_delete',{title: 'Delete Author', author:author, authorBooks: authorBooks})
})

exports.author_delete_post = asyncHandler(async(req,res,next)=>{
    const[author, authorBooks] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ])
    
    if(authorBooks.length > 0){
        res.render('author_delete',{title: 'Delete Author', author: author, authorBooks: authorBooks,})
        return
    }
    else{
        await Author.findByIdAndDelete(req.body.authorid).exec()
        res.redirect('/catalog/authors')
    }
})

exports.author_update_get = asyncHandler(async(req,res,next)=>{
    const author = await Author.findById(req.params.id).exec()
    res.render('author_form',{
        title: 'Update author',
        author: author,
    })
})

exports.author_update_post = [
    upload.single('author_photo'),

    body('first_name')
    .trim()
    .isLength({min: 2})
    .escape()
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('Name shouldn`t contain non-alphanumeric characters'),
    body('last_name')
    .trim()
    .isLength({min: 2})
    .withMessage('Surname must be specified')
    .isAlphanumeric()
    .withMessage('Name shouldn`t contain non-alphanumeric characters'),
    body('date_of_birth','Invalid date')
    .isISO8601()
    .toDate(),
    body('date_of_death','Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),   
    
    asyncHandler(async(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const author = await Author.findById(req.params.id).exec()
            res.render('author_form',{
                title: 'Update author',
                author: author,
                errors: errors.array(),
            })
            return
        }
        else{
            const updatedAuthor = await Author.findByIdAndUpdate(req.params.id,{
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                photo: req.file? '/authorPics/' + path.basename(req.file.path): req.body.photo_url,
                _id: req.params.id,
            })
            res.redirect(updatedAuthor.url)
        }
    })
]