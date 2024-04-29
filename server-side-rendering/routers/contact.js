const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', async (req, res) => {
  res.render('pages/contact/index');
});

router.post('/', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'thisismytrashfortest1@gmail.com',
            pass:'rkru fsbn aapi poyz'
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'thisismytrashfortest1@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            res.send('error');
        } else {
            res.send('success');
        }
    })
})

module.exports = router;