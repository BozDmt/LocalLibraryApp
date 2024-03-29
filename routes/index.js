var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //if user is logged in, redirect to catalog, otherwise pull up login page- this prevents clients without
  //profiles from seeing the website content, as well as users already logged in
  //wanting to get to the login page???
  //actually, hide only the functionality for create/edit; also, add a button to loan the books.
  res.redirect('/catalog');
});

module.exports = router;
