const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session) //il risultato del passaggio dell'oggeto session creato nella riga precedente e passato qui, alla funzione risultante del require di mongo connect, viene memorizzato in mongo db;

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = 'mongodb://root:root@cluster0sandro-shard-00-00.nhkls.mongodb.net:27017,cluster0sandro-shard-00-01.nhkls.mongodb.net:27017,cluster0sandro-shard-00-02.nhkls.mongodb.net:27017/shop?ssl=true&replicaSet=atlas-i3inac-shard-0&authSource=admin&retryWrites=true&w=majority';


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  //potrei anche inserire una data di scadenza in modo tale che mongo db pulisca a un certo punto i dati raccolti 
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'dovrebbe essere una lunga stringa', resave: false, saveUninitialized: false, store: store }))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Alex',
          email: 'alex@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
