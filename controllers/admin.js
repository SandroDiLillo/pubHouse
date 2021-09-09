const Product = require('../models/product');
const Author = require('../models/author');
const fileHelper = require('../util/file')
const { validationResult } = require('express-validator/check')

const ITEMS_PER_PAGE = 6;



exports.getAddProduct = (req, res, next) => {

  // if (!req.session.isLoggedIn) {
  //   return res.redirect('/login')
  // }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: '',
    validationErrors: [],
    
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path; //nel database devo salvare solo il path dell'immagine che verrà salvata nel filesystem

  const product = new Product({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      // throw new Error('Dummy')
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;  
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) { //solo se inseriamo l'immagine la sovrascriverà
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};



exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()//posso inserire un filtro solo per l'utente che l'ha creato con ({ userId: req.user._id})
    .skip( (page - 1) * ITEMS_PER_PAGE )
    .limit(ITEMS_PER_PAGE) 
  }) // // .select('title price -_id')// .populate('userId', 'name')
  .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};


exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return next(new Error('Product not found.'));
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({ _id: prodId, userId: req.user._id });
  })
  .then(() => {
    console.log('DESTROYED PRODUCT');
    res.status(200).json({ message: 'Success!' });
  })
  .catch(err => {
    res.status(500).json({ message: 'Deleting product failed.' });
  });
};


  // Product.findByIdAndRemove(prodId)
  //   .then(() => {
  //     console.log('DESTROYED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
    // })
// };







exports.getAddAuthor = (req, res, next) => {
  res.render('admin/edit-author', {
    pageTitle: 'Add Author',
    path: '/admin/add-author',
    editing: false,
    hasError: false,
    errorMessage: '',
    validationErrors: [],
  });
};




exports.postAddAuthor = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-author', {
      pageTitle: 'Add Author',
      path: '/admin/add-author',
      editing: false,
      hasError: true,
      product: {
        name: name,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-author', {
      pageTitle: 'Add Author',
      path: '/admin/add-author',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      author: {
        name: name,
        description: description,
        imageUrl: imageUrl,
      },
      validationErrors: errors.array()
    })
  }
  const imageUrl = image.path;
  const author = new Author({
    name: name,
    description: description,
    imageUrl: imageUrl
  });
  author
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Author');
      res.redirect('/admin/authors');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};




exports.getEditAuthor = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const authsId = req.params.authorId;


  
  Author.findById(authsId)
    .then(author => {
      if (!author) {
        return res.redirect('/');
      }
      res.render('admin/edit-author', {
        pageTitle: 'Edit Author',
        path: '/admin/edit-author',
        editing: editMode,
        author: author,
        hasError: false,
        errorMessage: '',
        validationErrors: [],
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.postEditAuthor = (req, res, next) => {
  const authId = req.body.authorId;
  const updatedName = req.body.name;
  // const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const image = req.file;  


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-author', {
      pageTitle: 'Edit Author',
      path: '/admin/edit-author',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      author: {
        name: updatedName,
        description: updatedDesc,
      
        _id: authId
      },
      validationErrors: errors.array()
    })
  }

  Author.findById(authId)
    .then(author => {
      if (image) { //solo se inseriamo l'immagine la sovrascriverà
        fileHelper.deleteFile(author.imageUrl);
        author.imageUrl = image.path;
      }
      author.name = updatedName;
      author.description = updatedDesc;
      author.imageUrl = updatedImageUrl;
      return author.save()
      .then(result => {
        console.log('UPDATED AUTHOR!');
        res.redirect('/admin/authors');
      });
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.getAuthors = (req, res, next) => {
  Author.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(authors => {
      console.log(authors);
      res.render('admin/authors', {
        auths: authors,
        pageTitle: 'Admin Authors',
        path: '/admin/authors'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};

exports.postDeleteAuthor = (req, res, next) => {
  const authId = req.body.authorId;
  Author.findByIdAndRemove(authId)
    .then(() => {
      console.log('DESTROYED AUTHOR');
      res.redirect('/admin/authors');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
};
