const express = require('express');
const { check, body } = require('express-validator/check'); // destrutturiamo il validator crecupeando le cose che ci servono 
const authController = require('../controllers/auth');
const user = require('../models/user');
const User = require('../models/user')
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [ //inseriamo un middleware per validare la richiesta e capire se l'utente ha inserito una mail
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value })
        .then(user => {
          if (!user) {
            return Promise.reject('Invalid email, please sign up before');
          } 
        })
    })
    .normalizeEmail({gmail_remove_dots: false}),
    body('password', 'Please enter a password with only numbers and text and at least 8 character ')
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
], authController.postLogin);

router.post('/signup', 
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email exists already, please picka  different one ');
          } 
        })
    })
    .normalizeEmail(),
    body('name', 'Please enter a valid name')
    .isLength( { min: 2 }),
    body('password', 'Please enter a password with only numbers and text and at least 8 character ')
    .isLength({ min: 8})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .isLength({ min: 8})
    .isAlphanumeric()
    .custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    })
    .trim(),
],
 authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword); //nel controller cerco un token e devo metterlo come paramentro qui

router.post('/new-password', authController.postNewPassword); //nel controller cerco un token e devo metterlo come paramentro qui


module.exports = router;