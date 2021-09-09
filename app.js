const path = require('path');
const fs = require('fs')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session'); //pacchetto della suite di express, ci permette di lavorare con la sessione 
const MongoDBStore = require('connect-mongodb-session')(session) //il risultato del passaggio dell'oggeto session creato nella riga precedente e passato qui, alla funzione risultante del require di mongo connect, viene memorizzato in mongo db;
const flash = require('connect-flash'); //npm i connect-flash
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan')
const https = require('https')

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0sandro-shard-00-00.nhkls.mongodb.net:27017,cluster0sandro-shard-00-01.nhkls.mongodb.net:27017,cluster0sandro-shard-00-02.nhkls.mongodb.net:27017/${process.env.MONGO_DATABASE}?ssl=true&replicaSet=atlas-i3inac-shard-0&authSource=admin&retryWrites=true&w=majority`;
const csrf = require('csurf')

const favicon = require('serve-favicon')

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  //potrei anche inserire una data di scadenza in modo tale che mongo db pulisca a un certo punto i dati raccolti 
});
const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({ //dove e come salviamo i file 
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => { // che tipo di file 
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
   { flags: 'a'}
   );

app.use(helmet(
  {
    contentSecurityPolicy: false,
  }
)); //setta header protet
app.use(compression()); //comprime css e js
app.use(morgan('combined', { stream: accessLogStream })); //login data

app.use(bodyParser.urlencoded({ extended: false }));


app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images'))); //servire staticamente i mostri file, dicendo che se c'è un path con /images deve prenderlo da... 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(session({
   secret: 'dovrebbe essere una lunga stringa', 
   resave: false, 
   saveUninitialized: false, 
   store: store
   }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } //verifichiamo che ci sia un utente di "sessione" se c'è..
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next(); // non conserviamo l'user, potrebbe essere stato cancellato in un database intermedio
      }
      req.user = user;
      cart = req.user.cart.items
      next();
    })
    .catch(err => {
      next(new Error(err));
      // throw new Error(err)
      // console.log(err)
    });
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.csrfToken = req.csrfToken();
  user = req.session.user;
  
  next();
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error)
  // res.status(error.httpStatusCode).render(...);
  res.redirect('/500');
  // res.status(500).render('500', {
  //   pageTitle: 'Error!',
  //   path: '/500',
  //   isAuthenticated: req.session.isLoggedIn
  // });
});

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    // https.createServer({key: privateKey, cert: certificate} , app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
