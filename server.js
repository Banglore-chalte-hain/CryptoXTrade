const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const cookie_parser = require("cookie-parser");

const app = express();
app.use(cookie_parser());


const corsOptions ={
   origin:'http://localhost:3000', 
   credentials:true,            
   optionSuccessStatus:200,
   
}

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors(corsOptions))
// Passport Config
require('./src/config/passport')(passport);

// DB Config
const db = require('./src/config/keys').mongoURI;

// // EJS
// app.use(expressLayouts);
// app.set('view engine', 'ejs');

app.use(express.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/login', require('./src/routes/index.js'));
app.use('/users', require('./src/routes/users.js'));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => app.listen(PORT, console.log(`Server running on  ${PORT}`))
  )
  .catch(err => console.log(err));


