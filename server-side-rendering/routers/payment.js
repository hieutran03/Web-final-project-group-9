const express = require('express');
const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk")

const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    "Ab-rm5wfaI2ZthgqL6RKBiLb48rOszx8RARcghydngiKjXXmkJqrkXJtMbJiaqbIomuv6lfwoCopy-kF",
    "ENEAa22CfxBijnhgkTt-HPJeoTVr-eZcFy4WLo1RPMSedcXjx_cKw_d2Vq8jfrHmswqMihkZZz1gIaAf"
  )
)

router.post('/create-order', async (req, res) => {
  const totalPrice = req.body.totalPrice
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalPrice,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: totalPrice,
            },
          },
        },
        items: req.body.items.map(item => {
          const storeItem = item.products;
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.finalPrice,
            },
            quantity: item.quantity,
          }
        }),
      },
    ],
  })
  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
router.get('/test', async (req, res) => {
  res.send();
})
module.exports = router;