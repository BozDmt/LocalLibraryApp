import paginate from 'express-paginate'
import jwt from 'jsonwebtoken'
import Book from '../models/book.js'
import Author from '../models/author.js'
import Genre from '../models/genre.js'
import BookInstance from '../models/bookInstance.js'
import {body, validationResult} from'express-validator'
import path from 'path'
import multer from 'multer'
// import user from '../models/user,js'
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/bookCovers')
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({storage: storage})
    
export function index (req,res,next){
    const token = req.cookies.jwt? jwt.decode(req.cookies.jwt): null
    
    // let loggedIn = token? true : false
        
    // const userdata = JSON.parse(req.user) || null
    // console.log(userdata)
    Promise.all([
        Book.countDocuments({}).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({status: 'Available'}).exec(),
    ])
    .then((data)=>{
        const [
            numBooks,
            numAuthors,
            numGenres,
            numBookInstances,
            numAvailableBookInstances
        ] = data

        res.render('index',{
            book_count: numBooks,
            author_count: numAuthors,
            genre_count: numGenres,
            bookinstance_count: numBookInstances,
            avl_bookinstance_count: numAvailableBookInstances,
            // logged_in: loggedIn
            // user_url:userURL.url,
            // user: userdata,
            //way to determine if there is a user, and which role he is
        })
    })

    // userURL = await jwt.decode(req.cookies.jwt,process.env.ACCESS_TOKEN_SECRET)

}

export function book_list (req,res,next){
    Promise.all([Book.find({},'title author cover genre')
    .sort({title: 1})
    .populate('author')
    .populate('genre.list')
    .skip(req.skip)
    .limit(req.query.limit)
    .exec(),
    Genre.find({}).exec()
    ,Book.countDocuments({},null)])
    .then((data)=>{
        const [allBooks,genres,bookCount] = data
        const pageCount = Math.ceil(bookCount / req.query.limit)

        res.render('book_list', 
            {
                title: 'Book List', 
                book_list: allBooks, 
                pageCount: pageCount,
                genres:genres,
                pages: paginate.getArrayPages(req)(10,pageCount,req.query.page)
            }
        )
    })

    
/**Gotta learn about data denormalization. When a book is created, store not only the genre ref, but the genre name
 * in a separate field; the thing I'm trying to achieve is for relational databases.
 */
}

export function book_detail (req,res,next){
    Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre').exec(),
        BookInstance.find({book: req.params.id}).exec(),
    ])
    .then((data)=>{
        const [bookDetails,bookinstance] = data

        if(bookDetails === null){
            const err = new Error('Book not found')
            err.status = 404
            return next(err)
        }
    
        res.render('book_details', {
            book_title: bookDetails.title, 
            book_detail: bookDetails, 
            book_instance: bookinstance
        })
    })
    
}

export function book_create_get (req,res,next){
    Promise.all([
        Author.find().sort({last_name: 1}).exec(),
        Genre.find().sort({name: 1}).exec()
    ])
    .then((data)=>{
        const [allAuthors,allGenres] = data

        res.render('book_form',{title:'Create Book',authors: allAuthors, genres: allGenres})
    })

}

export const book_create_post = [
    (req,res,next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === 'undefined'? []:[req.body.genre]
        }
        next()
    },
    
    body('authorName')
    ,body('title')
    .trim()
    .isLength({max:40})
    .blacklist('<>')
    .withMessage('Title must be specified')
    ,body('summary','Summary must be provided')
    .trim()
    .blacklist('<>')
    ,body('isbn','ISBN must be specified')
    .trim()
    .escape()
    ,body('genre.*')
    .escape(),
    
    upload.single('book_cover'),

    (req,res,next) =>{
        const errors = validationResult(req)
        
        const book = new Book({
            title: req.body.title,
            author: req.body.authorName,
            genre: req.body.genre,
            isbn: req.body.isbn,
            summary: req.body.summary,
            cover: req.file? '/bookCovers/' + path.basename(req.file.path): undefined,
        })

        if(!errors.isEmpty()){
            Promise.all([
                Author.find().sort({last_name: 1}).exec(),
                Genre.find().sort({name: 1}).exec()
            ])
            .then((data)=>{
                const [allAuthors,allGenres] = data

                for(genre of allGenres){
                    if(book.genre.includes(genre._id)){
                        genre.checked = 'true'
                    }
                }
                res.render('book_form',{
                    title: 'Create Book',
                    authors: allAuthors,
                    genres: allGenres,
                    book:book,
                    errors: errors.array(),
                })
            })
        }
        else{
            Book.find({title: req.body.title}).exec()
            .then((exists)=>{
                const bookExists = exists

                if(bookExists === null || bookExists === undefined){
                    res.send(`Book '${bookExists}' exists`)
                }
                else{
                    book.save()
                    // res.setHeader('Cookie',`${book.title}`)apparently headers are sent now
                    res.redirect(book.url)
                }
            })
        }
    }]

    export function book_delete_get (req,res,next){
        Promise.all([
            Book.findById(req.params.id).exec(),
            BookInstance.find({book: req.params.id},'book imprint status due_back'),
        ])
        .then((data)=>{
            const [book, bookCopies] = data
            
            res.render('book_delete', {
                title: 'Delete book',
                book:book,
                copies: bookCopies,
            })
        })

}

export function book_delete_post (req,res,next){
    Promise.all([
        Book.findById(req.params.id).exec(),
        BookInstance.find({book: req.params.id},'book imprint status due_back'),
    ])
    .then((data)=>{
        const [book, bookCopies] = data

        if(bookCopies.length > 0){
            res.render('book_delete', {
                title: 'Delete book',
                book:book,
                copies: bookCopies,
            })
            
        }
        else{
            Book.findByIdAndDelete(req.body.bookid).exec()
            res.redirect('/catalog/books')
        }
    })
}

export function book_update_get (req,res,next){
    Promise.all([
        Book.findById(req.params.id).exec(),
        Author.find({}).sort({last_name: 1}).exec(),
        Genre.find({}).sort({name: 1}).exec(),
    ])
    .then((data)=>{
        const [book,allAuthors,allGenres] = data
        
        if(book===null){
            const err = new Error('Book not found')
            err.status = 404
            next(err)
        }
    
        allGenres.forEach((genre) => {
            if(book.genre.includes(genre._id)){
                genre.checked = true
            }
        });
    
        res.render('book_form',{
            title: 'Update book',
            book:book,
            authors:allAuthors,
            genres:allGenres,
        })
    })

}

export const book_update_post = [
    upload.single('book_cover'),
    
    body('authorName')
    ,body('title','title must be specified')
    .trim()
    .isLength({min: 1})
    .blacklist('<>')
    ,body('summary','Summary must be provided')
    .trim()
    .isLength({min: 1})
    .blacklist('<>')
    ,body('isbn','ISBN must be specified')
    .trim()
    .isLength({min: 1})
    .escape()
    .blacklist('<>')
    ,body('genre.*')
    .escape(),
    
    (req,res,next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === 'undefined'? []:[req.body.genre]
        }
        next()
    },
    
    
    (req,res,next) =>{
        const errors = validationResult(req)

        const book = new Book({
            title: req.body.title,
            author: req.body.authorName,
            isbn: req.body.isbn,
            summary: req.body.summary,
            genre: typeof req.body.genre === 'undefined' ? []: req.body.genre,
            cover: req.file? '/bookCovers/' + path.basename(req.file.path): req.body.cover_url,
            _id: req.params.id,//old id should be passed bc after update it changes
        })

        if(!errors.isEmpty()){
            Promise.all([
                Author.find().sort({last_name: 1}).exec(),
                Genre.find().sort({name: 1}).exec()
            ])
            .then((data)=>{
                const [allAuthors,allGenres] = data
      
                for(genre of allGenres){
                    if(book.genre.includes(genre._id)){
                        genre.checked = 'true'
                    }
                }
    
                res.render('book_form',{
                    title: 'Update book',
                    authors: allAuthors,
                    genres: allGenres,
                    book:book,
                    errors: errors.array(),
                })
            })
        }
        else{
                Book.findByIdAndUpdate(req.params.id,book,{})
                .then((book)=>{
                    const updatedBook = book
                    res.redirect(updatedBook.url)
                })
            }
    }
]
