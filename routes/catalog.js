import express from 'express'
const router = express.Router()
// const authentication = require('./auth')

import * as author_controller from '../controllers/authorController.js'
import * as book_controller from '../controllers/bookController.js'
import * as bookInstance_controller from '../controllers/bookinstanceController.js'
import * as genre_controller from '../controllers/genreController.js'

// router.use(authentication.refreshAccessToken)
// router.use(authentication.authenticateToken)
//home page
router.get('/',book_controller.index)

router.get('/book/create',book_controller.book_create_get)
router.post('/book/create',book_controller.book_create_post)

router.get('/book/:id/update',book_controller.book_update_get)
router.post('/book/:id/update',book_controller.book_update_post)

router.get('/book/:id/delete',book_controller.book_delete_get)
router.post('/book/:id/delete',book_controller.book_delete_post)

router.get('/book/:id',book_controller.book_detail)

router.get('/books',/*authentication.refreshAccessToken,*/book_controller.book_list)

//authors
router.get('/author/create', author_controller.author_create_get)
router.post('/author/create', author_controller.author_create_post)

router.get( '/author/:id/update', author_controller.author_update_get)
router.post('/author/:id/update', author_controller.author_update_post)

router.get( '/author/:id/delete', author_controller.author_delete_get)
router.post('/author/:id/delete', author_controller.author_delete_post)

router.get('/author/:id', author_controller.author_detail)
router.get('/authors', author_controller.author_list)

//bookinstances
router.get('/bookInstance/create', bookInstance_controller.bookInstance_create_get)
router.post('/bookInstance/create', bookInstance_controller.bookInstance_create_post)

router.get('/bookInstance/:id/update', bookInstance_controller.bookInstance_update_get)
router.post('/bookInstance/:id/update', bookInstance_controller.bookInstance_update_post)

router.get( '/bookInstance/:id/delete', bookInstance_controller.bookInstance_delete_get)
router.post('/bookInstance/:id/delete', bookInstance_controller.bookInstance_delete_post)

router.get('/bookinstance/:id/loan', bookInstance_controller.bookinstance_loan_get)
router.post('/bookinstance/:id/loan',bookInstance_controller.bookinstance_loan_post)

router.get('/bookinstance/:id/return',bookInstance_controller.bookinstance_return_get)
router.post('/bookinstance/:id/return',bookInstance_controller.bookinstance_return_post)

router.get( '/bookInstance/:id', bookInstance_controller.bookInstance_detail)
router.get('/bookInstances', bookInstance_controller.bookInstance_list)

//genres
router.get( '/genre/create', genre_controller.genre_create_get)
router.post('/genre/create', genre_controller.genre_create_post)

router.get('/genre/:id/delete', genre_controller.genre_delete_get)
router.post('/genre/:id/delete', genre_controller.genre_delete_post)

router.get('/genre/:id', genre_controller.genre_detail)
router.get('/genres', genre_controller.genre_list)
router.get('/genres/ids',genre_controller.genre_id_list_get)

//scripts
// router.get('/scripts',book_controller)

export {router as catalogRouter}