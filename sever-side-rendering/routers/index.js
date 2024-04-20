const homeRouter = require('./home');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const ordersRouter = require('./orders');
const { getAuth, requireAuth } = require('../middlewares/auth');

module.exports = (app)=>{
  app.use('/',getAuth, homeRouter);
  app.use('/catergories',getAuth, categoriesRouter);
  app.use('/products',getAuth, productsRouter);
  app.use('/users', usersRouter);
  app.use('/orders',requireAuth, ordersRouter);
}