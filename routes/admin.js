const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);




// /admin/add-author => GET
router.get('/add-author', isAuth, adminController.getAddAuthor);

// /admin/authors => GET
router.get('/authors', isAuth, adminController.getAuthors);

// /admin/add-author => POST
router.post('/add-author', isAuth, adminController.postAddAuthor);

router.get('/edit-author/:authorId', isAuth, adminController.getEditAuthor);

router.post('/edit-author', isAuth, adminController.postEditAuthor);

router.post('/delete-author', isAuth, adminController.postDeleteAuthor);

module.exports = router;
