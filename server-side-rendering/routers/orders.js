const { Order } = require('../models/order');
const { User } = require('../models/user');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get('/', async (req, res) => {
  const orderList = await Order.find({ user: req.user._id}).populate('orderItems.product').sort({ 'dateOrdered': -1 });
  console.log(orderList)
  // if (!orderList) {
  //   res.status(500).json({ success: false })
  // }
  res.render('pages/orders', {
    user: req.user,
    orders: orderList
  });
})

router.get('/create', async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.products");
  const items = user.cart;
  const totalPrice = user.totalPrice;
  console.log(items)
  res.render('pages/orders/create', {
    user: req.user,
    items: items,
    totalPrice: totalPrice,
  });
});

router.post('/create', async (req, res) => {

  const order = new Order({
    receiver: req.body.receiver === '' ? req.user.username : req.body.receiver,
    address: req.body.address === '' ? req.user.address : req.body.address,
    phone: req.body.phone === '' ? '123456789' : req.body.phone,
    status: req.body.paymentMethod === 'Paypal' ? 'Paid' : 'Pending',
    totalPrice: req.body.totalPrice,
    user: req.user._id,
    orderItems: req.body.items.map(item => {
      return {
        product: item.products._id,
        quantity: item.quantity
      }
    })
  });
  await order.save();
  req.user.cart = [];
  await req.user.save();
  // const orderList = await Order.find().populate('user', 'username').sort({ 'dateOrdered': -1 });
  // console.log(orderList)
  res.redirect('/orders');
});
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
    // .populate('user', 'username')
    .populate({
      path: 'orderItems', populate: {
        path: 'product', populate: 'category'
      }
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
})

router.post('/', async (req, res) => {
  const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })

    newOrderItem = await newOrderItem.save();

    return newOrderItem._id;
  }))
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product');

    const totalPrice = orderItem.product.finalPrice * orderItem.quantity;
    return totalPrice;
  }))
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    totalPrice: totalPrice,
    user: req.body.user,
  })
  order = await order.save();

  if (!order)
    return res.status(400).send('The order cannot be created!')

  res.send(order);
})

router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    { new: true }
  )

  if (!order)
    return res.status(400).send('The order cannot be update!')

  res.send(order);
})

router.delete('/:id', (req, res) => {
  Order.findByIdAndDelete(req.params.id).then(async order => {
    if (order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({ success: true, message: 'The order is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "Order not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
})

router.get('/get/totalsales', async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
  ])

  if (!totalSales) {
    return res.status(400).send('The order sales cannot be generated')
  }

  res.send({ totalsales: totalSales.pop().totalsales })
})

router.get('/get/count', async (req, res) => {
  const orderCount = await Order.countDocuments({}, { hint: "_id_" });

  if (!orderCount) {
    res.status(500).json({ success: false })
  }
  res.send({
    orderCount: orderCount
  });
})

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid }).populate({
    path: 'orderItems', populate: {
      path: 'product', populate: 'category'
    }
  }).sort({ 'dateOrdered': -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false })
  }
  res.send(userOrderList);
})

module.exports = router;