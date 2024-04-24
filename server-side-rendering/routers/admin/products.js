const express = require('express');
const { Product } = require('../../models/product');
const { Category } = require('../../models/category');
const upload = require('../../middlewares/multer');
const uploadCloud = require('../../middlewares/uploadCloud');
const paginationHelper = require('../../helpers/pagination');
const router = express.Router();

router.get('/', async (req, res) => {
  const find = {
    deleted: false
  };
  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // End Pagination

  const products = await Product.find(find)
    .sort({ position: 'desc' })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render('admin/pages/products/index', {
    currentPage: 'products',
    products: products,
    pagination: objectPagination,
  });
});

router.get('/create', async (req, res) => {
  const categories = await Category.find({ deleted: false });

  res.render('admin/pages/products/create', {
    currentPage: 'products',
    categories: categories,
  });
});

router.post('/create',
  upload.single('image'),
  uploadCloud.upload,
  async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.countInStock = parseInt(req.body.countInStock);

    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`/admin/products`);
  }
);

router.get('/edit/:id',async (req,res)=>{
  const product = await Product.findById(req.params.id);
  const categories = await Category.find({deleted: false});
  res.render('admin/pages/products/edit',{
    product: product,
    categories: categories,
  });
})

router.patch('/edit/:id',
  upload.single('image'),
  uploadCloud.upload,
  async (req,res)=>{
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.countInStock = parseInt(req.body.countInStock);
    req.body.position = parseInt(req.body.position);
    await Product.findByIdAndUpdate(req.params.id,req.body);
    res.redirect('/admin/products');
  }
)
module.exports = router;