const { Category } = require('../models/category');

module.exports = async (req, res, next) => {
  const categories = await Category.find({ deleted: false });
  res.locals.categories = categories;
  next();
};
