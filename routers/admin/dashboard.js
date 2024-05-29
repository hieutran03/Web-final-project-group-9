const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  res.render('admin/pages/dashboard/index.pug', {currentPage: 'dashboard'});
});
module.exports = router;