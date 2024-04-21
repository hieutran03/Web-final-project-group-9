const dashboardRouter = require('./dashboard');
const productsRouter = require('./products');
module.exports = (app) => {
  app.use('/admin', dashboardRouter);
  app.use('/admin/products', productsRouter);
}