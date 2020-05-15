const router = require('express').Router();
const Ordermodel = require('../model/order-model');
var flash = require('express-flash');
const authCheck = (req,res,next)=>{
  if(!req.user){
    res.redirect('/auth/login');
  }
  else {
    next();
  }
}


router.get('/home',function(req,res){
  req.flash('messages');
  res.render('home',{user:req.user,userinfo:req.session.user});
});


router.get('/list',function (req,res) {
  res.render('listpage',{user:req.user,userinfo:req.session.user});
});

router.get('/confirmation',function (req,res) {
  res.render('confirmation',{user:req.user,userinfo:req.session.user});
});


router.get('/dashboard',function (req,res) {
  var user=  req.session.user;
  var user2 = req.user;
  if(user){
  var ordersId= user[0].orders.order_id;
  }
  else if (user2) {
    var ordersId = user2.orders.order_id;
  }
  Ordermodel.findOne({order_id:ordersId}).then((order_data)=>{
    console.log(order_data);

      res.render('dashboard',{user:req.user,userinfo:req.session.user,order:order_data});

  });

});

router.get('/logout',(req,res)=>{
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      console.log('Maual logged out');
      res.redirect('home');
  }
  else {
    req.logout();
    console.log('Google logged out');
    res.redirect('../home');
  }

});

router.get('/',authCheck,(req,res)=>{
  res.render('home',{user:req.user,userinfo:null});
});

module.exports = router;
