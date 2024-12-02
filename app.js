import dotenv from 'dotenv';
dotenv.config({path:'./.env'})
import mongoose  from 'mongoose'
import paginate from 'express-paginate'
import createError from 'http-errors';
import helmet from 'helmet'
import express from 'express';
const app = express();
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import crypto from 'node:crypto'
import cors from 'cors'
import indexRouter from './routes/index.js'
import {usersRouter} from './routes/users.js'
import {authMw} from './middleware/authenticate.js'
import {authzMw} from './middleware/authorize.js'
// const profilesRouter = require('./routes/profiles')
import {catalogRouter} from './routes/catalog.js'
import {loginRouter} from './routes/login.js'
// view engine setup
app.set('title','The local Library')
app.set('views', path.join(dirname('.'), 'views'));
app.set('view engine', 'pug');

// app.use(
//   helmet.contentSecurityPolicy({
//     directives:{
//       'script-src' : ["'self'","code.jquery.com","cdn.jsdelivr.net"],
//     },
//   })
// )
// app.use(cors())
function setNoCacheHeaders(req, res, next) {
  // Set cache-control headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

// Set no-cache headers
app.use(paginate.middleware(3,50))
app.use(setNoCacheHeaders);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname('.'), 'public')));

app.use('/',authMw, indexRouter);
//testing purposes
app.use('/user', usersRouter);
// app.use('/user/profile', profilesRouter)
//testing purposes
app.use('/catalog',/*authzMw.verifyToken,*/catalogRouter)
app.use('/login'/*,authMw.login_post*/,loginRouter)

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
const mongoConnection = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2'

main().catch((err) => console.log(err))
async function main(){
  await mongoose.connect(mongoConnection)
}

export default app