require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// important to put the encrupted before model

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
});

const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.post('/login', (req, res) => {
  User.findOne(
    {
      user: req.body.username,
      password: req.body.password,
    },
    (err, result) => {
      if (result) {
        res.render('secrets');
      } else if (err) {
        res.render(err);
      } else {
        res.send('No such user found');
      }
    }
  );
});

app.listen(port, () => {
  console.log('Server is already running');
});
