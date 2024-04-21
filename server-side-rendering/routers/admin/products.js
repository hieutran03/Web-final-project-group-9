const express = require('express');
const { Product } = require('../../models/product');
const { Category } = require('../../models/category');
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
module.exports = router;