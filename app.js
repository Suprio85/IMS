var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cron = require('node-cron');

//body parser and cookies
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//oracle connection
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');


const session = require('express-session');
const flash = require('connect-flash');

var schedule = require("./schedules");



// Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var shopmanagerRouter = require('./routes/shopmanager');
var ownerRouter = require('./routes/owner');   
var productionmanagerRouter = require('./routes/productionmanager');
var hashRouter = require('./routes/hash');
var cashierRouter = require('./routes/cashier');
var  zsmRouter = require('./routes/zonalsupplymanager');
var profileRouter = require('./routes/profile');   
var rsmRouter = require("./routes/regionalSupplyManager");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({ secret: '123321', resave: false, saveUninitialized: true }));
app.use(flash());


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
app.use('/shopmanager', shopmanagerRouter);
app.use('/owner', ownerRouter);
app.use('/productionmanager', productionmanagerRouter);
app.use('/hash', hashRouter);
app.use('/cashier', cashierRouter);
app.use('/zsm', zsmRouter);
app.use('/profile', profileRouter);
app.use('/rsm', rsmRouter);


// Running all the proceedures automatically at 2:00 am on 2nd and 17th each month
cron.schedule("0 2 2,17 * * *", async()=>{
   console.log("Hii, Look I am running");
   console.log("Running Monthly Sale Porceedure");
   let success = await schedule.runMonthlySaleProceedure();
   if(success){
      console.log("It ran successfully");
   }
   success = await schedule.updatePriceProcedure();
   console.log("Running Update Price Procedure");
   if(success)
      console.log("Price updated Successfully");
   
   console.log("Updating Status of Pending requests");
   success = await schedule.updateRequestStatus();
   if(success)
      console.log("Request statuses Updated to 'PROCESSING' Successfully");
   
})




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
