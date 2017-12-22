const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Initialize application
const app = express();


//Map global promise -> get rid of warning
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect('mongodb://localhost/onlinenotesdevdb', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Load Note Model
require('./models/note');
const Note = mongoose.model('notes');

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//Method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//Global variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//About route
app.get('/about', (req, res) => {
  res.render('about');
});


//User login route
app.get('/users/login', (req, res)=> {
  res.send('login');
});

//User register route
app.get('/users/register', (req, res)=> {
  res.send('register');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});