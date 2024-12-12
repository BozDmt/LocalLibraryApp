import Genre from '../models/genre.js'
import Book from '../models/book.js'
import {body, validationResult} from 'express-validator'

function listIds (){return new Promise((resolve,reject)=>{
    Genre.find({},{_id: 1}).then(result=>resolve(result))
})}

export function genre_list(req,res,next){
    Genre.find()
    .sort({name: 1})
    .exec()
    .then(allGenres=>
        res.render('genre_list',{title: 'List of genres',genre_list: allGenres})
    )
    .catch((e)=>{console.error(e)})

}

export function genre_detail(req,res,next){
    // const [genre, booksInGenre] = 
    Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, 'title summary').exec(),
    ])
    .then(([genre,booksInGenre])=>{
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
    .catch((e)=>{console.error(e)})
}

//for such form, asyncHandler is unnecessary, as it is just a wrapper for error code, which in this case won't
//be present
export function genre_create_get (req,res,next){
    res.render('genre_form',{title: 'Create Genre'})
}

export const genre_create_post = [
    body('name', 'Genre name must be at least 3 characters long')
    .trim()
    .isLength({min: 3})
    .escape(),

     (req,res,next)=>{
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
            // const genreExists = 
            Genre.findOne({name: req.body.name})
            .exec()
            .then(genreExists=>{
                if(genreExists){
                    res.redirect(genreExists.url)
                }
                else{
                     genre.save()
                    res.redirect(genre.url)
                }
            })
        }
    }
]

export function genre_delete_get (req,res,next){
    Genre.findById(req.params.id)
    .then((genre)=>{res.render('genre_delete',{genre: genre})})
}

export function genre_delete_post (req,res,next){
    Genre.findByIdAndDelete(req.body.genreid)
    .exec()
    .then(res.redirect('/catalog/genres'))
}

export function genre_id_list_get (req,res,next){
    listIds()
    .then(result=>{
        const data = JSON.stringify(result)
        return res.send(data)
    })
    .catch((e)=>{console.error(e)})

}