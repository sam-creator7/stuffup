const router = require('express').Router();
const passport = require('passport');
//auth signup

router.get('/signup',(req,res) => {
  res.render('signup');
});



router.get('/home',function(req,res){
  res.render('home',{user:req.user,userinfo:null});
  });


//auth logout

router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('homeprofile');
});

//auth with google

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}));

//call route for google to redirect
router.get('/google/redirect',passport.authenticate('google'),(req,res)=> {
  res.redirect('/profile/')
});

module.exports = router;
