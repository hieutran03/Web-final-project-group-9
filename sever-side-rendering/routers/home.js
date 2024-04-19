const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('pages/home', { pageTitle: 'Home' });
});
// router.get('/login', async (req, res) => {
//   res.render('pages/login', { pageTitle: 'Login' });
// });
// router.post('/login', async (req, res) => {
//   const payload = req.body;

//   res.redirect('/');
// });

// router.get('/register', async (req, res) => {
//   res.render('pages/register', { pageTitle: 'Register' });
// });
module.exports = router;