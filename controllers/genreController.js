const Genre = require('../models/genre')
const Book = require('../models/book')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')

exports.genre_list = asyncHandler(async(req,res,next)=>{
    const allGenres = await Genre.find().sort({name: 1}).exec()

    res.render('genre_list',{title: 'List of genres',genre_list: allGenres})
})

exports.genre_detail = asyncHandler(async(req,res,next)=>{
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, 'title summary').exec(),
    ])

    if(genre === null){
        const err = new Error('Genre not found')
        err.status = 404
        return next(err)
    }

    res.render('genre_details',{
        title: 'Genre details',
        genre: genre,
        genre_books: booksInGenre,
    })
})

//for such form, asyncHandler is unnecessary, as it is just a wrapper for error code, which in this case won't
//be present
exports.genre_create_get = asyncHandler(async(req,res,next)=>{
    res.render('genre_form',{title: 'Create Genre'})
})

exports.genre_create_post = [
    body('name', 'Genre name must be at least 3 characters long')
    .trim()
    .isLength({min: 3})
    .escape(),

    asyncHandler(async (req,res,next)=>{
        const errors = validationResult(req)

        const genre = new Genre({name: req.body.name})

        if (!errors.isEmpty()){
            res.render('genre_form',{
                title: 'Create Genre',
                genre: genre,
                errors: errors.array(),
            })
            return
        }
        else{
            const genreExists = await Genre.findOne({name: req.body.name}).exec()
        
            if(genreExists){
                res.redirect(genreExists.url)
            }
            else{
                await genre.save()
                res.redirect(genre.url)
            }
        }
    })
]

exports.genre_delete_get = asyncHandler(async(req,res,next)=>{
    const genre = await Genre.findById(req.params.id)
    res.render('genre_delete',{genre: genre})
})

exports.genre_delete_post = asyncHandler(async(req,res,next)=>{
    Genre.findByIdAndDelete(req.body.genreid).exec()
    res.redirect('/catalog/genres')
})