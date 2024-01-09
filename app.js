var createError = require('http-errors');
var express = require('express');
var path = require('path');

//body parser and cookies
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//oracle connection
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');


// Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// middlewares
app.use(function(req, res, next) {
   req.dbConfig = dbConfig;             // middleware to available dbConfig to all routes
   next();
}); 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use ('/products', productsRouter);



async function run() {
  try{
  const connection = await oracledb.getConnection(dbConfig);
  await connection.close();
  console.log("Successfully connected to Oracle!");
   } catch(error) {
      console.log(error.message);
   }  // Always close connections
}

run();



//catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// //error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


module.exports = app;
