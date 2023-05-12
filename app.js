const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const data = require('./data.json');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  if (req.path !== '/login' && !req.session.loggedIn) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', (req, res) => {  
  if(req.session.loggedIn){
res.redirect('/');}
else{
  const errorMessage = req.query.error;
  res.render('login',{error: null})
}
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username; 

  if ((username === 'Sarath' && email === 'sarath@example.com' && password === 'password')||(username === 'John' && email === 'john@example.com' && password === 'password')){
    req.session.email = email;
    req.session.username = username; 
    req.session.loggedIn = true;   
    res.cookie('user', email);
    res.redirect('/');
  } else {
    res.render('login', { error: ' Invalid Username or email or password' });
  }
});


app.get('/', (req, res) => {
  if (req.session.email && req.session.username) {
    if (data && data.length > 0) {
      res.render('home', { user: req.session.username, data, errorMessage: null });
    } else {
      const errorMessage = 'Dummy content';
      res.render('home', { user: req.session.username, data: [], errorMessage });
    }
  } else {
    res.redirect('/login');
  }
});




app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie('user');
      const errorMessage = 'Logout Succesfully';
      res.render('login', {error:errorMessage});
    }
  });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
