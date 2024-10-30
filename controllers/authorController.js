const Author = require('../models/author')
const Book = require('../models/book')
const Genre = require('../models/genre')
const {body, validationResult} = require('express-validator')
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

exports.author_list = (req,res,next)=>{
    Author.find()
    .sort({last_name: 1})
    .exec().then((allAuthors)=>{
        res.render('author_list', {title: 'Author List', author_list: allAuthors})
    })

}

exports.author_detail = (req,res,next)=>{
    Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}).populate('genre').exec(),
    ]).then(([author,bookList])=>{

        const genres = []
        
        bookList.forEach((book)=>{
            if(book.genre.length > 0){
                for(val of book.genre){
                    genres.push(val.name)
                }
            }            
        })
        Genre.find({name: {$in: genres}}).exec()
        .then((genreList)=>{
            if(author === null){
                const err = new Error('Author not found')
                err.status = 404
                next(err)
            }
            res.render('author_details',{author: author, books: bookList, genres: genreList})
        })
    })
}

exports.author_create_get = (req,res,next)=>{
    res.render('author_form',{title: 'Create Author'})
}

exports.author_create_post = [
    upload.single('author_photo'),
    
    body('first_name')
    .trim()
    .isLength({max: 40})
    .escape()
    .withMessage('Input too long'),
    body('last_name')
    .trim()
    .isLength({max: 40})
    .withMessage('Input too long'),
    body('date_of_birth','Invalid date')
    .isISO8601()
    .toDate(),
    body('date_of_death','Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),

    (req,res,next)=>{
        const errors = validationResult(req)

        const author = new Author({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            photo: req.file? '/authorPics/' + path.basename(req.file.path):undefined,//'/authorPics/default_profile_pic',
        })

        if(!errors.isEmpty()){
            res.render('author_form',{
                title: 'Create Author',
                author: author,
                errors: errors.array(),
            })            
        }
        else{
            Author.findOne({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }).exec()
            .then((authorExists)=>{

                if(authorExists){
                    res.redirect(authorExists.url)
                }
                else{
                    author.save().then(()=>res.redirect(author.url))
                }
            })
            
        }
    }
]

exports.author_delete_get = (req,res,next)=>{
    Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]).then(([author, authorBooks] )=>{

        if(author === null){
            res.redirect('/catalog/authors')
        }
    
        res.render('author_delete',{title: 'Delete Author', author:author, authorBooks: authorBooks})
        res.end()
    })

}

exports.author_delete_post = (req,res,next)=>{
    Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]).then(([author, authorBooks])=>{

        if(authorBooks.length > 0){
            res.render('author_delete',{title: 'Delete Author', author: author, authorBooks: authorBooks,})
            return
        }
        else{
            Author.findByIdAndDelete(req.body.authorid).exec()
            .then(()=>{
                res.redirect('/catalog/authors')
            }).catch((e)=>console.error(e))
        }
    })   
}

exports.author_update_get = (req,res,next)=>{
    Author.findById(req.params.id).exec()
    .then((author)=>{
        res.render('author_form',{
            title: 'Update author',
            author: author,
        })
    })
}

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
    
    (req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            Author.findById(req.params.id).exec()
            .then((author)=>{

                res.render('author_form',{
                    title: 'Update author',
                    author: author,
                    errors: errors.array(),
                })
                res.end()
            })
        }
        else{
            Author.findByIdAndUpdate(req.params.id,{
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                photo: req.file? '/authorPics/' + path.basename(req.file.path): req.body.photo_url,
                _id: req.params.id,
            }).then((updatedAuthor)=>{
                res.redirect(updatedAuthor.url)
            })
        }
    }
]