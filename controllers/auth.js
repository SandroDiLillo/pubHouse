const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
  
  let message = req.flash('error');
  console.log(message)
  if(message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user) {
      req.flash('error', 'Invalid email ');
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if(doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session
        .save((err) => {
          console.log(err);
          res.redirect('/'); 
        })
      }
      req.flash('error', 'Invalid password');
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err)
    });
   
  })
  .catch(err => console.log(err));
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age:100; HttpOnly;' ),
  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err =>{
    console.log(err);
    res.redirect('/');
  } )
  
};


exports.getSignup = (req, res, next) => {
  let message = req.flash('errorSingup');
  console.log(message)
  if(message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email})
  .then( userDoc => {
    if(userDoc) {
      req.flash('errorSingup', 'Email exists already ');
      return res.redirect('/signup')
    }
    return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
        cart: { items: []}
      });
      return user.save();
    })
    .then( result => {
      res.redirect('/');
    });
  })
  .catch(err => {
    console.log(err)
  });

};



