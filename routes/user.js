var router=require('express').Router();
module.exports=router;
var mongoose=require('mongoose');
var UserModel=require('../models/user');
var passport=require('passport');
var passportConf=require('../config/passport');

router.get('/login',function(req,res){
    // if(req.user) return res.redirect('/');
    res.render('accounts/login',{ message : req.flash('loginMessage')});
})

router.get('/signup',function(req,res){
res.render('accounts/signup',{
    errors: req.flash('errors')
});
})


router.post('/signup',function(req,res,next){
    var user = new UserModel();
    user.profile.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;
    user.profile.picture =user.gravatar();

    UserModel.findOne({email:req.body.email},function(err,UserExists){
        if(UserExists){
          req.flash('errors','Account with that email id already exists');
            return res.redirect('/signup');
        } else {
            user.save((err,user)=>{
                if(err) return next(err);
          req.logIn(user,function(err){
              if(err) return next(err);
              res.redirect('/profile');
          })
            })
        }
    })
})
  
router.post('/login',passport.authenticate('local-login',{

    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
}));

router.get('/profile',function(req,res,next){
    UserModel.findOne({_id:req.user._id},function(err,user){
        if(err) return next(err);
        res.render('accounts/profile',{user:user});
    })
});

router.get('/logout',function(req,res,next){
    req.logOut();
    res.redirect('/');
})

router.get('/edit-profile',function(req,res,next){
    res.render('accounts/edit-profile',{ message1:req.flash('success')});
});

router.post('/edit-profile', function(req,res,next){
    UserModel.findOne({ _id:req.user._id},function(err,user){
        if(err) return next(err);

        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.address) user.address = req.body.address;

        user.save(function(err){
            if(err) return next(err);
            req.flash('success','Successfully Edited your Profile');
            return res.redirect('/edit-profile');
        });
    });
});