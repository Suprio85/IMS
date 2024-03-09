const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

// Secret key for signing and verifying JWTs
const secretKey = '123123'; // Replace with a strong and secure key



router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  const errorMessage = req.flash('error')[0];
  res.status(200).render('login', { title: 'Login Information', errorMessage: errorMessage });
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const connection = await oracledb.getConnection(dbConfig);

   
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex').toUpperCase();

    console.log(hashedPassword);

    const result = await connection.execute(
      `SELECT EMPLOYEE_ID, USERNAME, JOB_ID FROM EMPLOYEES WHERE username = :username AND USER_PASSWORD = :password`,
      { username, password: hashedPassword } // Use the hashed password in the query
    );

    if (result.rows.length === 1) {
      // Successful login
      const user = {
        id: result.rows[0][0],
        username: result.rows[0][1],
        job_id: result.rows[0][2]
      };

      // Generate a JWT token
      const token = jwt.sign(user, secretKey, { expiresIn: '30d' }); // Expires in 30 days

      // Set the token in a cookie
      res.cookie('Remember', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      req.session.user = user; // Store user in session
      req.flash('success', 'Successfully logged in');
      if(user.job_id === 'MD') res.redirect('/owner');
      else if(user.job_id === 'ShM') res.redirect('/shopmanager');
      else if(user.job_id === 'PM') res.redirect('/productionmanager');
      else if(user.job_id === 'CASHIER') res.redirect('/cashier');
      else if(user.job_id==='ZSM')  res.redirect('/zsm');
      else if(user.job_id==='RSM') res.redirect('/rsm');
      else res.redirect('/owner');
    } else {
      // Invalid username/password
      req.flash('error', 'Invalid username or password');
      res.redirect('/login');
    }

    await connection.close();
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/logout', function (req, res, next) {
  res.clearCookie('Remember'); // Clear the JWT token cookie
  req.session.destroy(); // Destroy the session
  res.redirect('/');
});

router.get('/user', isAuthenticated, async function (req, res, next) {
  const successMessage = req.flash('success')[0];
  const user = req.session.user;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Fetch products from the database
    const result = await connection.execute(`SELECT * FROM PRODUCT`);
    const products = result.rows;

    // Release the connection
    await connection.close();

    res.status(200).render('user', { title: 'User Information', username: user.username, products: products, successMessage: successMessage });
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

function isAuthenticated(req, res, next) {
  const token = req.cookies.Remember;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {

      return res.redirect('/login');
    }

    req.session.user = decoded; // Store user in session
    next();
  });
}

module.exports = router;
