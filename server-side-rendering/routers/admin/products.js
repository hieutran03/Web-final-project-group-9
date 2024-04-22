const express = require('express');
const { Product } = require('../../models/product');
const { Category } = require('../../models/category');
const upload = require('../../middlewares/multer');
const uploadCloud = require('../../middlewares/uploadCloud');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({ deleted: false }).sort({ createdAt: 'desc' });
  const pagination = {
    limitItems: 5,
    currentPage: 1,
  }
  res.render('admin/pages/products/index', {
    currentPage: 'products',
    products: products,
    pagination: pagination,
  });
});

router.get('/create', async(req, res) => {
  const categories = await Category.find({ deleted: false });
  
  res.render('admin/pages/products/create', {
    currentPage: 'products',
    categories: categories,
  });
});

router.post('/create',
  upload.single('image'),
  uploadCloud.upload,
  async(req, res) => {
    console.log(req.file);
    console.log(req.body);
    // const { name, price, category, description } = req.body;
    // const product = new Product({
    //   name: name,
    //   price: price,
    //   category: category,
    //   description: description,
    //   image: req.file.path,
    // });
    // await product.save();
    // res.redirect('/admin/products');
  }
);
module.exports = router;