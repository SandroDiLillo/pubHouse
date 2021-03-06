const path = require('path');

const express = require('express');
const { check, body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, isAdmin, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, isAdmin, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Please enter a valid Author'),
    // body('imageUrl')
    //     .isURL()
    //     .withMessage('Please enter a url for image'),
    body('price')
        .isNumeric()
        .withMessage('Please enter a number'),
    body('description')
        .isLength({ min: 2 })
        .withMessage('Please enter a description')
        .isLength({ max: 1000 })
        .withMessage('Oh no! description is too long')

], isAuth, isAdmin,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, isAdmin, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Please enter a valid Author'),
    // body('imageUrl')
    //     .isURL()
    //     .withMessage('Please enter a url for image'),
    body('price')
        .isNumeric()
        .withMessage('Please enter a number'),
    body('description')
        .isLength({ min: 2 })
        .withMessage('Please enter a description')
        .isLength({ max: 1000 })
        .withMessage('Oh no! description is too long')

],
    isAuth, isAdmin, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, isAdmin, adminController.deleteProduct);




// /admin/add-author => GET
router.get('/add-author', isAuth, isAdmin, adminController.getAddAuthor);

// /admin/authors => GET
router.get('/authors', isAuth, isAdmin, adminController.getAuthors);

// /admin/add-author => POST
router.post('/add-author',
    [
        body('name')
            .isString()
            .isLength({ min: 3 })
            .withMessage('Please enter a valid Author'),
        body('description')
            .isLength({ min: 2 })
            .withMessage('Please enter a description')
            .isLength({ max: 2000 })
            .withMessage('Oh no! description is too long')

    ],
    isAuth, isAdmin, adminController.postAddAuthor);

router.get('/edit-author/:authorId', isAuth, isAdmin, adminController.getEditAuthor);

router.post('/edit-author',
    [
        body('name')
            .isString()
            .isLength({ min: 3 })
            .withMessage('Please enter a valid Author'),
        body('description')
            .isLength({ min: 2 })
            .withMessage('Please enter a description')
            .isLength({ max: 2000 })
            .withMessage('Oh no! description is too long')

    ],
    isAuth, isAdmin, adminController.postEditAuthor);

router.post('/delete-author', isAuth, isAdmin, adminController.postDeleteAuthor);

module.exports = router;
