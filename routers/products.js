const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const searchHelper = require('../helpers/search');
const paginationHelper = require('../helpers/pagination');
const { getAuth, requireAuth } = require('../middlewares/auth');
const ProductViewed = require('../models/productsViewed');
const { ProductRating } = require('../models/productRating');
router.get('/', async (req, res) => {
  const objectSearch = searchHelper(req.query);

  const find = {
    deleted: false,
    status: 'active',
  }
  let category = {
    name: 'Tất cả sản phẩm',
  };
  if (req.query.category) {
    category = await Category.findOne({
      uniqueName: req.query.category,
    });
    if (category) {
      find.category = category._id;
    }
  }
  if (objectSearch.regex) {
    find.name = objectSearch.regex;
  }
  //pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 8,
    },
    req.query,
    countProducts
  );
  // End Pagination
  const products = await Product.find(find)
    .sort({ position: 'desc' })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  const pagination = {
    currentPage: 1,
    totalPage: 2,
  }
  res.render('pages/products', {
    user: req.user,
    pagination: pagination,
    products: products,
    keywork: objectSearch.keywork,
    category: category.name,
    pagination: objectPagination,
  });
})
router.get('/detail/:id', getAuth, async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId).populate(['comments.user', 'comments.childComments.user']);
  const sameProducts = await Product.find({ category: product.category, _id: { $ne: productId } }).limit(4);
  const productRating = await ProductRating.findOne({ productId: productId });
  let rating = 0;
  let analysisRating = {
    star5: 0,
    star4: 0,
    star3: 0,
    star2: 0,
    star1: 0,
  };
  let totalRating = 1;
  if (product) {
    if (req.user) {
      const userHistory = await ProductViewed.findOne({ userId: req.user._id });
      if (!userHistory) {
        let newUserHistory = new ProductViewed({
          userId: req.user._id,
          viewedProducts: [{ productId: productId, viewedAt: Date.now() }]
        })
        await newUserHistory.save();
      } else {
        const viewedProductIndex = userHistory.viewedProducts.findIndex(vp => vp.productId.toString() === productId);
        if (viewedProductIndex === -1) {
          userHistory.viewedProducts.push({ productId: productId, viewedAt: Date.now() });
        } else {
          userHistory.viewedProducts[viewedProductIndex].viewedAt = Date.now();
        }
        await userHistory.save();
      }

    }
    if (productRating) {
      console.log(productRating);
      if (req.user) {
        const userRating = productRating.users.find(u => u.userID.toString() === req.user._id.toString());
        if (userRating) {
          rating = userRating.rating;
        }
      }

      analysisRating = productRating.analysisRating;
      totalRating = productRating.totalRating;
    }

    res.render('pages/products/detail', {
      user: req.user,
      product: product,
      rating: rating,
      analysisRating: analysisRating,
      totalRating: totalRating,
      sameProducts: sameProducts,
    });
  } else {
    res.redirect('/');
  }

});
router.post('/comment/:id', requireAuth, async (req, res) => {
  try {

    const productId = req.params.id.split('-')[0];
    const commentId = req.params.id.split('-')[1];
    const product = await Product.findById(productId);
    if (product) {
      if (commentId) {
        const commentToReply = product.comments.findIndex(c => c._id.toString() === commentId)
        product.comments[commentToReply].childComments.push({
          user: req.user._id,
          content: req.body.content,
        });
      } else {
        product.comments.unshift({
          user: req.user._id,
          content: req.body.content,
        });
      }

      console.log(product);
      await product.save();
      res.redirect(`/products/detail/${productId}`);
    } else {
      res.redirect(`/products/detail/${productId}`);
    }
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
});
router.post('/rating/:id', requireAuth, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;
  const rating = req.body.rating;
  const productRating = await ProductRating.findOne({ productId: productId });
  if (productRating) {
    const index = productRating.users.findIndex(u => u.userID.toString() == userId);
    if (index === -1) {
      productRating.users.push({ userID: userId, rating: rating });
      productRating.analysisRating['star' + rating]++;
    } else {
      productRating.analysisRating['star' + productRating.users[index].rating]--;
      productRating.analysisRating['star' + rating]++;
      productRating.users[index].rating = rating;
    }
    await productRating.save();
    res.redirect(`/products/detail/${productId}`);
  } else {
    const newProductRating = new ProductRating({
      productId: productId,
      analysisRating: {
        star5: rating == 5 ? 1 : 0,
        star4: rating == 4 ? 1 : 0,
        star3: rating == 3 ? 1 : 0,
        star2: rating == 2 ? 1 : 0,
        star1: rating == 1 ? 1 : 0,
      },
      users: [{ userID: userId, rating: rating }]
    });
    await newProductRating.save();
    res.status(200).json({ message: 'Rating success!' });
  }
});

module.exports = router;


// router.get('/:id', async (req, res) => {
//   if (!mongoose.isValidObjectId(req.params.id)) {
//     return res.status(400).send('Invalid Product ID')
//   }

//   const product = await Product.findById(req.params.id).populate('category');

//   if (!product) {
//     res.status(500).json({ success: false })
//   }
//   res.send(product);
// })



// // router.post('/', uploadOptions.single('image'), async (req, res) => {
// router.post('/', async (req, res) => {
//   // if (!mongoose.isValidObjectId(req.body.category)) {
//   //   return res.status(400).send('Invalid Category ID');
//   // }

//   // const file = req.file;
//   // if (!file) return res.status(400).send('No image in the request');

//   // const fileName = req.file.filename
//   // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//   console.log(req.body);
//   let product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     // image: `${basePath}${fileName}`,
//     image: req.body.image,
//     // brand: req.body.brand,
//     price: parseInt(req.body.price),
//     category: req.body.category,
//     countInStock: parseInt(req.body.countInStock),
//     // rating: req.body.rating,
//     // numReviews: req.body.numReviews,
//     // dateCreated: req.body.dateCreated
//   })
//   product = await product.save();

//   if (!product) {
//     return res.status(500).send('The product cannot be created!')
//   }

//   res.send(product)
// })

// router.put('/:id', async (req, res) => {

//   if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.body.category)) {
//     return res.status(400).send('Invalid Product ID / Category ID')
//   }

//   const category = await Category.findById(req.body.category);

//   const product = await Product.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       description: req.body.description,
//       images: req.body.images,
//       brand: req.body.brand,
//       price: req.body.price,
//       category: req.body.category,
//       countInStock: req.body.countInStock,
//       rating: req.body.rating,
//       numReviews: req.body.numReviews,
//       dateCreated: req.body.dateCreated
//     },
//     { new: true }
//   )
//   if (!product) {
//     res.status(500).json({ message: 'Cannot update product!' });
//   }

//   res.status(200).send(product);
// })

// router.delete('/:id', (req, res) => {
//   Product.findByIdAndDelete(req.params.id).then(product => {
//     if (product) {
//       return res.status(200).json({ success: true, message: 'The product is deleted!' })
//     } else {
//       return res.status(404).json({ success: false, message: 'The product not found!. Check ID again!' })
//     }
//   }).catch(err => {
//     return res.status(400).json({ success: false, error: err })
//   })
// })

// router.get('/get/count', async (req, res) => {
//   const productCount = await Product.countDocuments({}, { hint: "_id_" });

//   if (!productCount) {
//     res.status(500).json({ success: false })
//   }

//   res.send({
//     productCount: productCount
//   })
// })

// router.put(
//   '/gallery-images/:id',
//   uploadOptions.array('images', 10),
//   async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).send('Invalid Product Id');
//     }
//     const files = req.files
//     let imagesPaths = [];
//     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

//     if (files) {
//       files.map(file => {
//         imagesPaths.push(`${basePath}${file.filename}`);
//       })
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         images: imagesPaths
//       },
//       { new: true }
//     )

//     if (!product)
//       return res.status(500).send('the gallery cannot be updated!');

//     res.send(product);
//   }
// )

