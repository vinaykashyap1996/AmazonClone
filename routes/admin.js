var router=require('express').Router();
var Category=require('../models/category');
var mongoose=require('mongoose');
module.exports=router;


router.get('/add-category',(req,res)=>{
    res.render('admin/add-category',{ message : req.flash('success')});
});

router.post('/add-category',function(req,res,next){
    var category = new Category();
    category.name=req.body.name;

    category.save(function(err){
        if(err) return  next(err);
        req.flash('success','Successfully added a category');
        return  res.redirect('/add-category');
    });
});