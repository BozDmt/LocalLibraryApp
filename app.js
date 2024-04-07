const mongoose = require('mongoose')
const createError = require('http-errors');
const helmet = require('helmet')
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const wiki = require('./routes/wiki')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profiles')
const catalogRouter = require('./routes/catalog')
const loginRouter = require('./routes/login')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  helmet.contentSecurityPolicy({
    directives:{
      'script-src' : ["'self'","code.jquery.com","cdn.jsdelivr.net"],
    },
  })
)

function setNoCacheHeaders(req, res, next) {
  // Set cache-control headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

// Set no-cache headers
app.use(setNoCacheHeaders);
app.use('/wiki',wiki)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//testing purposes
app.use('/users', usersRouter);
app.use('/users/profiles', profilesRouter)
//testing purposes
app.use('/catalog',catalogRouter)
app.use('/login',loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.set('strictQuery', false)
const mongoConnection = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5'

main().catch((err) => console.log(err))
async function main(){
  await mongoose.connect(mongoConnection)
}
module.exports = app;
