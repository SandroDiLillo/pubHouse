const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);




// /admin/add-author => GET
router.get('/add-author', adminController.getAddAuthor);

// /admin/authors => GET
router.get('/authors', adminController.getAuthors);

// /admin/add-author => POST
router.post('/add-author', adminController.postAddAuthor);

router.get('/edit-author/:authorId', adminController.getEditAuthor);

router.post('/edit-author', adminController.postEditAuthor);

router.post('/delete-author', adminController.postDeleteAuthor);

module.exports = router;
