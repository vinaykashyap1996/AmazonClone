var express= require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var ejs =require('ejs');
var ejsmate=require('ejs-mate')
var session=require('express-session');
var cookieParser=require('cookie-parser');
var flash=require('express-flash');
var Mongostore=require('connect-mongo')(session);
var passport=require('passport');



app.use(express.static(__dirname + '/public' ));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:"Vinay$%^&*@1234Kashyap",
    store:new Mongostore({url:"mongodb://localhost:27017/Amazon",autoReconnect:true})
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.user=req.user;
    next();
})
var config=require('./config/keys');


var mainRoutes=require('./routes/main');
var userRoute=require('./routes/user');

app.use(mainRoutes);
app.use(userRoute);
mongoose.connect(config.DB_URL, { useNewUrlParser: true }, function (err) {
    if (err) console.log('Error While connecting to DB:');
    else console.log("DB Connected Successfully");
  });




app.listen(5000,(err)=>{
    if(err) throw err;
    console.log(`server is running on port 5000`)
})