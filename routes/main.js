var router=require('express').Router();
module.exports=router;

router.get('/',(req,res)=>{
    res.render('main/home')
})

