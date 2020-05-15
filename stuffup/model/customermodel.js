const mongoose = require('mongoose');
var passportLocalMongoose=require("passport-local-mongoose");

var schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {type:String, unique:true,required:true},
  resetPasswordToken:String,
  resetPasswordExpires:Date,
  phoneno: {type:Number, unique:true,required:true},
  password: String,
  adress:{"flat/houseno":String,"building":String,"landMark":String,"pincode":Number,"city":String,"state":String,"country":String},
  orders:[{order_id:Number}]
});
schema.plugin(passportLocalMongoose);

var Customermodel = mongoose.model('Customermodel',schema);

module.exports = Customermodel;
