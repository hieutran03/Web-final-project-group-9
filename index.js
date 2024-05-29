const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('req-flash');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
// const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const routes = require('./routers');
const adminRoutes = require('./routers/admin');
require('dotenv/config');

const api = process.env.API_URL;
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.options('*', cors());
// parse application/x-www-form-urlencoded


app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Middleware
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({ secret: '123' }));
app.use(flash());
flash({ locals: 'flash' })

//app.use(morgan('tiny'));
//app.use(authJwt());
app.use(errorHandler);

//Routes
routes(app);
adminRoutes(app);

//Database
mongoose.connect(process.env.MONGODB_URI)
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