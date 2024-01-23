var express = require('express');
var router = express.Router();
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');

let user = null;
let token = null;

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `SELECT * FROM USER_INFO WHERE username = :username AND password = :password`,
        { username, password }
      );

      console.log(result.rows);


      if (result.rows.length === 1) {
        user = {
          id: result.rows[0][0],
          username: result.rows[0][1],
          password: result.rows[0][2]
        }


        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(token);

        await connection.close();
        return done(null, { user, token });
      }
      else {
        // Handle invalid username/password
        await connection.close();
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    }
    catch (error) {
      console.error('Error executing query:', error);
      return done(error);
    }
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.serializeUser(function (user, done) {
  done(null, { id: user.id, token: user.token, username: user.username });
});

passport.deserializeUser(async function (user, done) {
  try {
    if (user && user.token) {
      done(user.username, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err);
  }
});

router.use(passport.initialize());
router.use(passport.session());



router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/login', function (req, res, next) {

  const errorMessage = req.flash('error')[0];
  res.status(200).render('login', { title: 'Login Information',errorMessage: errorMessage });


});

router.post('/login', (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Set a success flash message
      req.flash('success', 'Successfully logged in');   
      return res.redirect('/user');
    });
  })(req, res, next);
});


router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


router.get('/user', isAuthenticated,async function (req, res, next) {
  const successMessage = req.flash('success')[0];
  console.log(user.username);
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Fetch products from the database
    const result = await connection.execute(`SELECT * FROM PRODUCT`);
    const products = result.rows;

    console.log(products);
    console.log(typeof(products));
    console.log(typeof(products[0].name));

    // Release the connection
    await connection.close();
    res.status(200).render('user', { title: 'User Information' , username : user.username, products: products, successMessage: successMessage});
  }
    catch{
      console.error('Error fetching data from the database:', error);
      res.status(500).send('Internal Server Error');
    }
});

// router.get('/posts', authenticateToken, (req, res) => {
//   console.log(req.user);
//   console.log(user.username);
//   res.json(posts.filter(user.username === req.user.name))
// })


// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   console.log("authHeader and token");
//   console.log(authHeader);
//   console.log(token);
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}





module.exports = router;
