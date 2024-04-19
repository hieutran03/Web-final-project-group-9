const homeRouter = require('./home');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const ordersRouter = require('./orders');

module.exports = (app)=>{
  app.use('/', homeRouter);
  app.use('/catergories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/users', usersRouter);
  app.use('/orders', ordersRouter);
}