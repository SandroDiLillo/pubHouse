const Product = require('../models/product');
const Author = require('../models/author');





exports.getAddProduct = (req, res, next) => {

  // if (!req.session.isLoggedIn) {
  //   return res.redirect('/login')
  // }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
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
      console.log(err);
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
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};







exports.getAddAuthor = (req, res, next) => {
  res.render('admin/edit-author', {
    pageTitle: 'Add Author',
    path: '/admin/add-author',
    editing: false,
  });
};

exports.postAddAuthor = (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
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
      console.log(err);
    });
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
        author: author
      });
    })
    .catch(err => console.log(err));
};

exports.postEditAuthor = (req, res, next) => {
  const authId = req.body.authorId;
  const updatedName = req.body.name;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Author.findById(authId)
    .then(author => {
      author.name = updatedName;
      author.description = updatedDesc;
      author.imageUrl = updatedImageUrl;
      return author.save();
    })
    .then(result => {
      console.log('UPDATED AUTHOR!');
      res.redirect('/admin/authors');
    })
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
};

exports.postDeleteAuthor = (req, res, next) => {
  const authId = req.body.authorId;
  Author.findByIdAndRemove(authId)
    .then(() => {
      console.log('DESTROYED AUTHOR');
      res.redirect('/admin/authors');
    })
    .catch(err => console.log(err));
};
