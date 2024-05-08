const express = require("express");
const { User } = require("../../models/user");
const router = express.Router();

global.totalOrder = 0;

router.get("/", async (req, res) => {
  const users = await User.find();
  users.forEach((user) => {
    console.log(user);
    totalOrder += user.cart.length;
  });

  res.render("admin/pages/dashboard/chartProduct.pug", {
    currentPage: "dashboard",
    totalOrder: totalOrder,
  });
});

module.exports = router;
