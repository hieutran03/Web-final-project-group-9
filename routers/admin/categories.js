const router = require('express').Router();
const paginationHelper = require('../../helpers/pagination');
const { Category } = require('../../models/category');

router.get('/', async (req, res) => {
  const find = {
    deleted: false
  };
  // Pagination
  const count = await Category.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    count
  );
  // End Pagination

  const categories = await Category.find(find)
    .sort({ position: 'desc' })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);


  res.render('admin/pages/categories/index', {
    currentPage: 'categories',
    categories: categories,
    pagination: objectPagination,
  });
});

router.get('/create', async (req, res) => {
  const categories = await Category.find({ deleted: false });

  res.render('admin/pages/categories/create', {
    currentPage: 'categories',
    categories: categories,
  });
});

router.post('/create',

  async (req, res) => {
    const category = new Category({name: req.body.name});
    category.save();
    res.redirect(`/admin/categories`);
  }
);



router.delete('/delete/:id', async(req,res)=>{
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Category.updateOne(
    { _id: id },
    {
      deleted: true,
    }
  );

  // req.flash("success", `Đã xóa thành công sản phẩm!`);

  res.redirect("back");
});
module.exports = router;