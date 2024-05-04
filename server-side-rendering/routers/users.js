const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { getAuth } = require('../middlewares/auth');
const nodemailer = require('nodemailer');
const UserOTPVerification = require('../models/UserOTPVerification');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user:'thisismytrashfortest1@gmail.com',
      pass:'rkru fsbn aapi poyz'
  }
})

router.get('/login',getAuth, async (req, res) => {
  if(req.user){
    return res.redirect('/');
  }
  res.render('pages/login-register/login', { pageTitle: 'Login' });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  const secret = process.env.secret;

  if (!user) {
    return res.render('pages/login-register/login', { message: 'Username không tồn tại!' });
  }

  if (user && bcrypt.compareSync(req.body.password, user.passHash)) {
    if (user.verified==true){
      const token = jwt.sign(
        {
          userId: user._id,
          //isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '1d' }
      )
  
      res.cookie("token", token, {maxAge: 24*3600*1000});
      res.redirect('/');
    } else {
      resendOTP(user._id,user.email);
      return res.render('pages/login-register/verify', { pageTitle: 'Verify', userId: user._id, message: `Kiểm tra OTP tại ${user.email}`});
    }
    
  } else {
    return res.render('pages/login-register/login', { message: 'Sai mật khẩu!' });
  }

})
router.post('/logout', (req, res)=>{
  res.clearCookie('token');
  res.redirect('/');
});
router.get('/register', getAuth, async (req, res) => {
  if(req.user){
    return res.redirect('/');
  }
  res.render('pages/login-register/register', { pageTitle: 'Register' });
});

router.post('/register', async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email.trim() });
  const usernameExist = await User.findOne({ username: req.body.username.trim() });
  if(emailExist) {
    return res.render('pages/login-register/register', { message: 'Email đã được đăng ký!' });
  }

  if (usernameExist) {
    return res.render('pages/login-register/register', { message: 'Username đã được đăng ký!' });
  }

  let isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : false;
  let user = new User({
    username: req.body.username.trim(),
    email: req.body.email.trim(),
    passHash: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address.trim(),
    isAdmin: isAdmin,
    verified: false,
  })
  let userId = "";
  await user.save().then((result) => {
    userId = result._id;
    if (user.isAdmin==true){
      sendOTPVerificationEmail({ _id: user._id, email: "thisismytrashfortest1@gmail.com"});
      res.render('pages/login-register/verify', { pageTitle: 'Verify', userId: user._id, message: `Kiểm tra OTP tại email quản trị` });
    }else{
      sendOTPVerificationEmail(result);
      res.render('pages/login-register/verify', { pageTitle: 'Verify', userId: user._id, message: `Kiểm tra OTP tại ${user.email}` });
    }
  });
})
router.get('/', async (req, res) => {
  const userList = await User.find().select('-passHash');

  if (!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList);
})

router.get('/lost_password', getAuth, async (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('pages/login-register/lost_password', { pageTitle: 'Lost password' });
});

router.post('/lost_password', async (req, res) => {
  try{
    let email = req.body.email;
    if (!email) {
      throw Error("Empty required field!");
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error(
          "Don't find user with that email!"
        );
      } else {
        await sendLinkLostPassword({_id: user._id, email: email, });
        res.json({
          status: "success",
          message: "Check your email!",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
  
});

router.get('/resetpassword', getAuth, async (req, res) => {
  if (req.user) {
    return res.render('pages/login-register/resetpassword', { pageTitle: 'Reset password', userId: req.user._id });
  }else{
    const userId = req.query.userid;
    if (userId){
      return res.render('pages/login-register/resetpassword', { pageTitle: 'Lost password', userId: userId });
    }else {
      return res.render('pages/login-register/resetpassword', { pageTitle: 'Lost password', message: "You shouldn't go there. Get out!"});
    }
  }
});

router.post('/resetpassword', async (req, res) => {
  let userId = req.body.userId;
  let newPassword = req.body.newPassword;
  if (!userId||!newPassword){
    res.json({
      status: "FAILED",
      message: "Check again your parameter!",
    });
  }
  await User.updateOne({ _id: userId }, { password: newPassword });

  try {
    let userId = req.body.userId;
    let newPassword = req.body.newPassword;
    if (!userId || !newPassword) {
      throw Error("Empty required field!");
    } else {
      await User.updateOne({ _id: userId }, { passHash: bcrypt.hashSync(newPassword, 10) });
      res.json({
        status: "success",
        message: "Reset pass successfully. Please login again with your new password!",
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});


router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid user ID')
  }

  const user = await User.findById(req.params.id).select('-passHash');

  if (!user) {
    res.status(500).json({ message: 'The user with given ID was not found!' });
  }

  res.status(200).send(user);
})

router.post('/', async (req, res) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    passHash: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
    isAdmin: req.body.isAdmin,
  })
  user = await user.save();

  if (!user) {
    return res.status(404).send('The user cannot be created!');
  }

  res.send(user);
})


router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id).then(user => {
    if (user) {
      return res.status(200).json({ success: true, message: 'The user is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: 'The user not found!' })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
})

router.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments({}, { hint: "_id_" })

  if (!userCount) {
    res.status(500).json({ success: false })
  }
  res.send({
    userCount: userCount
  });
})

router.post('/verify', async (req, res) => {
  try{
    let userId = req.body.userId;
    let otp = req.body.otp;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed!");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords <= 0) {
        throw new Error (
          "Account record doesn't exist or has been verified already!"
        );
      } else {
        const {expireAt} = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if (expireAt < Date.now()){
          await UserOTPVerification.deleteMany({userId});
          throw new Error("Code has expired. Please request again!");
        }else{
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP){
            throw new Error("Invalid code passed!");
          }else {
            await User.updateOne({ _id: userId}, { verified: true});
            await UserOTPVerification.deleteMany({userId});
            res.json({
              status:"VERIFIED",
              message: "User email verified successfully.",
            })
          }
        }
      }
    }
  }catch (error){
    res.json({
      status: "FAILED",
      message: error.message,
    })
  }
})


const resendOTP = async ({userId, email})=>{
  try {
    if (!userId || !email) {
      throw Error("Empty user details are not allowed!");
    } else {
      await UserOTPVerification.deleteMany({userId});
      await sendOTPVerificationEmail({_id: userId, email: email});
    }

  } catch (error) {
    return
  }
}

const sendOTPVerificationEmail = async ({_id, email}) => {

  const user = await User.findOne({ _id: _id })
  try {
    const otp = `${Math.floor(10000000 + Math.random()*90000000)}`;
    const mailOptions = {
      from: "thisismytrashfortest1@gmail.com",
      to: email,
      subject: `Verify Your Account (${user.username}) At TechStore`,
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup process. This code <b>expires in 5 minutes</b>.`,

    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expireAt: Date.now() + 300000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

  } catch (error){
    res.json({
      status:"FAILED",
      message: "Something error occur!",
    })
  }
};

const sendLinkLostPassword = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(10000000 + Math.random() * 90000000)}`;
    const mailOptions = {
      from: "thisismytrashfortest1@gmail.com",
      to: email,
      subject: "TechStore Lost Password",
      html: `Click this link to reset your password account at <b>TechStore web</b>. <a href="http://localhost:3000/users/resetpassword?userid=${_id}">Link here</a>.`,

    };
    await transporter.sendMail(mailOptions);

  } catch (error) {
    res.json({
      status: "FAILED",
      message: "Something error occur!",
    })
  }
};


module.exports = router;