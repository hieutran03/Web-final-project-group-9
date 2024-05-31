const productsRouter = require('./products');
const categoriesRouter = require('./categories');
module.exports = (app) => {
  app.get('/admin', (req, res) => {
    res.render('admin/pages/intro/index', {
      currentPage: 'Intro',
    });
  });
  app.use('/admin/products', productsRouter);
  app.use('/admin/categories', categoriesRouter);
}