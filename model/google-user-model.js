const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
firstname: String,
lastname:String,
email:String,
googleid: String,
phoneno: Number,
adress:{"flat/houseno":String,"building":String,"landMark":String,"pincode":Number,"city":String,"state":String,"country":String},
orders:[{order_id:Number}]
});

const user = mongoose.model('googlecustomer',Schema);

module.exports = user;
