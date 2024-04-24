const express = require('express');
const {User} = require('../models/user');
const router = express.Router();
router.get('/', async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.products');
  const items = user.cart;
  const totalPrice = items.reduce((reduce, item) => {
    return reduce + (item.products.price*(100-item.products.discountPercentage))/100 * item.quantity;
  }, 0);
  res.render('pages/cart/index', {
    items: items,
    user: user,
    totalPrice: totalPrice
  });
});
router.post('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.body.quantity;
  const user = req.user;
  const index = user.cart.findIndex(item => item.products.toString() === productId);
  if(index >= 0){
    user.cart[index].quantity += parseInt(quantity);
  }
  else{
    user.cart.push({products: productId, quantity: parseInt(quantity)});
  }
  const updatedUser = await user.save();
  req.user = updatedUser;
  res.redirect('/products');
});
router.delete('/delete/:productId', async (req, res) => {
  const productId = req.params.productId;
  const user = req.user;
  const index = user.cart.findIndex(item => item.products.toString() === productId);
  if(index >= 0){
    user.cart.splice(index, 1);
  }
  const updatedUser = await user.save();
  req.user = updatedUser;
  res.redirect('/cart');
});
module.exports = router;