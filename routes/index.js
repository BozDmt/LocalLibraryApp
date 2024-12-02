import express from 'express'
import * as sessionController from '../controllers/sessionController.js'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //if user is logged in, redirect to catalog, otherwise pull up login page
  //actually, hide only the functionality for create/edit; also, add a button to loan the books.
  res.redirect('/catalog');
});
router.get('/getuser',sessionController.get_user)
router.get('/logout',sessionController.logout)

export default router