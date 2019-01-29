var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var UserModel=require('../models/user')

passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(err,user)=>{
        done(err,user);
    });
}); 

//MiddleWare
passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, (req,email,password,done)=>{
  UserModel.findOne({ email:email},(err,user)=>{
      if(err) return done(err);

      if(!user){
          return done(null,false,req.flash('loginMessage','No user has been found'))
      }
      if(!user.comparePassword(password)){
          return done(null,false,req.flash('loginMessage','!Oops ! Wrong Password'));
      }
      return done(null,user);
  })
}))

exports.isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}