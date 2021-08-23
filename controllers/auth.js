const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('611fbb309de6b42ba8f953c9')
  .then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/');
      
    })
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
