var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require('ejs');
var ejsmate = require('ejs-mate')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var Mongostore = require('connect-mongo')(session);
var passport = require('passport');
var Categories=require('./models/category');


app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "Vinay$%^&*@1234Kashyap",
    store: new Mongostore({ url: "mongodb://localhost:27017/Amazon", autoReconnect: true })
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(function(req,res,next){
    Categories.find({},function(err,categories){
        if(err) return  next(err);
        res.locals.categories=categories;
        next();
    });
});

var config = require('./config/keys');
var apiRoutes=require('./api/api');
var middleware=require('./middleware/middleware');
var mainRoutes = require('./routes/main');
var userRoute = require('./routes/user');
var adminRoutes = require('./routes/admin');
app.use(middleware);
app.use(mainRoutes);
app.use(userRoute);
app.use(adminRoutes);
app.use('/api',apiRoutes);
mongoose.connect(config.DB_URL, { useNewUrlParser: true }, function (err) {
    if (err) console.log('Error While connecting to DB:');
    else console.log("DB Connected Successfully");
});


app.listen(5500, (err) => {
    if (err) throw err;
    console.log(`server is running on port 5500`)
})