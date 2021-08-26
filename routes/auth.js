const express = require('express');
const { check, body } = require('express-validator/check')
const authController = require('../controllers/auth');
const user = require('../models/user');
const User = require('../models/user')
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value })
        .then(user => {
          if (!user) {
            return Promise.reject('Invalid email');
          } 
        })
    }),
    body('password', 'Please enter a password with only numbers and text and at least 8 character ')
    .isLength({ min: 8})
    .isAlphanumeric(),
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
    }),
    body('name', 'Please enter a valid name')
    .isLength( { min: 2 }),
    body('password', 'Please enter a password with only numbers and text and at least 8 character ')
    .isLength({ min: 8})
    .isAlphanumeric(),
    body('confirmPassword')
    .isLength({ min: 8})
    .isAlphanumeric()
    .custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    })
],
 authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword); //nel controller cerco un token e devo metterlo come paramentro qui

router.post('/new-password', authController.postNewPassword); //nel controller cerco un token e devo metterlo come paramentro qui


module.exports = router;