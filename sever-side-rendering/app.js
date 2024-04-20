const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const routes = require('./routers');
require('dotenv/config');
const api = process.env.API_URL;
app.use(cors());
app.use(express.static('public'));
app.options('*', cors());
// parse application/x-www-form-urlencoded


app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Middleware
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(morgan('tiny'));
//app.use(authJwt());
app.use(errorHandler);

//Routes
routes(app);

//Database
mongoose.connect('mongodb+srv://admin:admin@ecommerce.fh3ikky.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce')
.then(() => {
    console.log('Database connection is ready ...');
})
.catch((err) => {
    console.log(err);
})

//Server
app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})