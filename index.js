var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var express = require('express');
var exphandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-route.js');
const profileRoutes = require('./routes/profile-routes.js');
const passportSetup =require('./config/passport-setup');

var cookieParser = require('cookie-parser');
var session = require('express-session');//
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');
var flash = require('express-flash');
var fs = require('fs');
const cookieSession =require('cookie-session');//
const passport = require('passport');
const Ordermodel = require('./model/order-model');
var Customermodel = require('./model/customermodel.js');
const FeedbackModel = require('./model/feedback.js');

require('dotenv').config();
//load and intialize MessageBird SDK
//var messageBird = require('messagebird')('DGCJwCpUZPwVMdp1HdxEL5cFQ');

console.log(process.env);

var app = express();




/*app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  process.env:[process.env.session.cookiekey]
}));*/
app.use(cookieParser());//
app.use(cookieSession({//
    key: 'user_sid',
    secret: process.env.cookiekey,
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());

// middleware function to check for logged-in users
/*
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('home');

    } else {
        next();
    }
};*/


//intialize passport
app.use(passport.initialize());
app.use(passport.session());


var urlencoder = bodyParser.urlencoded({extended: false});

//connect to database
mongoose.connect(process.env.dbURI,{ useNewUrlParser: true });

//set up routes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
//create a Schema





var imgPath = './public/images/iconlist.png';

//saving_dummy_data.order_company_img.data = fs.readFileSync(imgPath);
//saving_dummy_data.order_company_img.contentType = 'image/png';


/*
var saving_dummy_data = Ordermodel({
  order_id:2510,
  order_pickup:{"flat/houseno":'D-501',"building":'Treasure Park',"landMark":'Sant Nagar',"pincode":'411009',"city":'Pune',"state":'Maharashtra',"country":'India'},
  order_drop:{"flat/houseno":'D-101',"building":'Shankar Apartments',"landMark":'Kothrud',"pincode":'411029',"city":'Pune',"state":'Maharashtra',"country":'India'},
  order_package_dimension:{"height":20.5,"width":50.505,"length":100},
  order_package_weight:25.10,
  order_package_description:'Its a package of great value',
  order_package_category:'Documents',
  order_package_category:'Paper',
  order_price:5100.50,
  order_status:'In-process',
  order_company_name:'FedX',
  order_company_img:{data:fs.readFileSync(imgPath),contentType: 'image/png'}
}).save(function(err){
  console.log('saved dummy order data')
});

*/

app.set('view engine','ejs');
app.use('/public/assets',express.static('public/assets'));



app.get('/home',function(req,res){
  console.log('Manual login');
  console.log(req.session.user);
  console.log('Google login');
  console.log('this'+req.user);
  res.render('home',{user:req.user,userinfo:req.session.user});
});


app.get('/',function(req,res){
  console.log('Manual login');
  console.log(req.session.user);
  console.log('Google login');
  console.log('this'+req.user);
  res.render('home',{user:req.user,userinfo:req.session.user});
});





app.get('/logout',(req,res)=>{
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      console.log('Maual logged out');
      res.redirect('home');
  }
  else {
    req.logout();
    console.log('Google logged out');
    res.redirect('home');
  }

});


app.get('/login',function(req,res){
  res.render('login');
});



app.post('/login',urlencoder,function(req,res){
  var iemail = req.body.email;
  var ipassword = req.body.password;

  console.log(iemail);

  Customermodel.findOne({email:iemail},function(err,data){
    if (!data) {
      req.flash('errorMessage','Wrong Username or Password :(')
      return  res.redirect('login');
    }
console.log(data);
    var remail = data.email;
    var rpassword = data.password;
    var username =data.firstname;
    console.log(username);
    if (remail == iemail && rpassword == ipassword) {
      console.log('login success');
 req.session.user = data;
 req.cookies = data;
 console.log('cookies');
 console.log(req.cookies.firstname);
console.log('Maual Login'+req.session.user);

      res.render('home',{userinfo:req.session.user});
    }
    else {
      req.flash('errorMessage','Wrong Username or Password :(')
        res.redirect('login');
    }

  });

});

app.get('/signup',function(req,res){

  res.render('signup');
});

app.post('/signup',urlencoder,function(req,res){

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var phoneno = req.body.phoneno;
  var password = req.body.password;
  var retypepassword = req.body.retypepassword;

  console.log(phoneno);
  console.log(email);
//   Customermodel.collection.dropIndex('username_1', function(err, result) {
//     if (err) {
//         console.log('Error in dropping index!', err);
//     }
// });

  if (password == retypepassword) {
    var save = Customermodel({  firstname: firstname,
      lastname: lastname,
      email: email,
      phoneno: phoneno,
      password: password}).save(function(err){
        if (err) {
          console.log('not saved');
          console.log(err);
          req.flash('errorMessage','Account already exists.');
          res.render('signup');
        }else {
          console.log('saved');
          req.flash('successMessage','Sign-up Success!')
            res.render('login');
        }

      });
    }
      else {
        req.flash('errorMessage2','Passwords do not Match');
        res.render('signup');
      }


});


app.get('/forgot',function(req,res){
res.render('forgot');
});

app.post('/forgot',urlencoder,function(req,res,next){
  async.waterfall([
    function (done) {
          crypto.randomBytes(20,function (err,buf) {
              var token = buf.toString('hex');
              done(err,token);
          });
    },
    function (token,done) {
      Customermodel.findOne({email:req.body.email},function (err,user) {
            if (!user) {
              req.flash('errorMessage','No account with given Email address exists.Please enter registered email address');

              return res.redirect('/forgot');
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; //1 hour

            user.save(function (err) {
              done(err,token,user);
            });
      });

    },
    function (token,user,done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: process.env.PORT||3000,
        secure: false,
        service: 'Gmail',
        auth:{
          user: 'stuffup.in@gmail.com',
          pass: process.env.GMAILPW
        },
        tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@stuffup.in',
        subject: 'Stuff Up Account Password Reset',
        text: 'Hey there,\n\nYou are receiving this beacuse you have requested for a change in password of your Stuff Up account.\n\n'+
        'Click on the following link provided below to complete the process of changing password.\n\n'+
        'https://'+ 'stuffup.herokuapp.com'  + '/reset/' + token + '\n\n' +
        // Put our domain name instead of loacal host headers host
        'If you did not request any password change, Please ignore this message and your password would not be changed.\n\n'+
        'Your safety and security is priority concern'
      };
      smtpTransport.sendMail(mailOptions,function (err) {
        console.log('Mail sent');
        req.flash('successMessage','An e-mail has been sent to '+ user.email +'.Please check for further instructions.');
        done(err,'done');
      });

    }
  ],
    function (err) {
      if (err) return next(err);
      res.redirect('/forgot');


  });

  });


app.get('/reset/:token',function (req,res) {
  Customermodel.findOne({ resetPasswordToken:req.params.token, resetPasswordExpires:{ $gt: Date.now() } },function (err,user) {
    if (!user) {
      req.flash('errorMessage','Password reset Token is invalid or expired.');
      return res.redirect('/forgot');
    }
  res.render('reset',{token:req.params.token});
  });

});

app.post('/reset/:token',urlencoder,function (req,res) {
  async.waterfall([
    function (done) {
      Customermodel.findOne({resetPasswordToken:req.params.token , resetPasswordExpires:{$gt:Date.now() } },function (err,user) {
        if(!user){
            req.flash('errorMessage','Password reset Token is invalid or expired.');
            return res.redirect('back');
        }
        if (req.body.password == req.body.confirm) {
          user.setPassword(req.body.password, function (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.password = req.body.password;
            user.save(function (err) {
              req.logIn(user,function (err) {
                done(err,user);
              });
            });
          })
        }else {
          req.flash('errorMessage','Passwords do not match.');
          return res.redirect('back');
        }

      });
    },
    function (user,done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: process.env.PORT||3000,
        secure: false,
        auth:{
          user: 'stuffup.in@gmail.com',
          pass: process.env.GMAILPW
        },  tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@stuffup.in',
        subject: 'Stuff Up Account Password Reset Completed',
        text: 'Hey there,\n\nPassword of Stuff Up account '+ user.email +' has been successfully changed.\n\n '

      };
      smtpTransport.sendMail(mailOptions,function (err) {
        console.log('Mail sent 2');
        req.flash('successMessage','Great! Your password has been changed.');
       done(err);
      });

    }
  ],function (err) {
    res.redirect('/login');
  });

});






app.get('/dashboard',function (req,res) {

var user=  req.session.user;
var user2 = req.user;
if(user){
var ordersId= user.orders.order_id;
}
else if (user2) {
  var ordersId = user2.orders.order_id;
}
Ordermodel.findOne({order_id:ordersId}).then((order_data)=>{
  console.log(order_data);

    res.render('dashboard',{user:req.user,userinfo:req.session.user,order:order_data});

});


});

app.post('/dashboard',urlencoder,function(req,res){

  var email = req.body.email;
  var phoneno = req.body.phoneno;

phoneno = '+91'+ phoneno;
console.log(phoneno);
  //Make request to Verify API
  // messageBird.verify.create(phoneno,{
  //   template : "Hey there,Your One-Time-Password is : %token.      Team Stuff Up",
  //    originator:"Stuff Up"
  //
  // },function(err,response){
  //   if(err){
  //     //Request failed
  //     console.log(err);
  //   }
  //   else {
  //     //request success
  //     console.log(response);
  //     res.render('/dashboard/#dialog');
  //   }


//  });

res.render('otpverification',{user:req.user,userinfo:req.session.user});
});


app.post('/feedback',urlencoder,function (req,res) {

var name =  req.body.conname;
var email = req.body.conemail;
var feedback = req.body.comments;

var save = FeedbackModel({
  name:name,
  email:email,
  feedback:feedback
}).save(function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('FeedbackSaved');
    req.flash('successMessage','Feedback SuccessFully Sent');
    res.render('home',{user:req.user,userinfo:req.session.user});
  }

})


});

app.get('/list',function (req,res) {
  res.render('listpage',{user:req.user,userinfo:req.session.user});
});

app.get('/confirmation',function (req,res) {
  res.render('confirmation',{user:req.user,userinfo:req.session.user});
});



app.listen(process.env.PORT || 3000);
