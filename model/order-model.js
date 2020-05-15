const mongoose = require('mongoose');



const schema2 = new mongoose.Schema({
  order_id:Number,
  order_pickup:{"flat/houseno":String,"building":String,"landMark":String,"pincode":Number,"city":String,"state":String,"country":String},
  order_drop:{"flat/houseno":String,"building":String,"landMark":String,"pincode":Number,"city":String,"state":String,"country":String},
  order_package_dimension:{"height":mongoose.Schema.Types.Double,"width":mongoose.Schema.Types.Double,"length":mongoose.Schema.Types.Double},
  order_package_weight:mongoose.Schema.Types.Double,
  order_package_description:String,
  order_package_category:String,
  order_package_category:String,
  order_price:mongoose.Schema.Types.Double,
  order_status:String,
  order_company_name:String,
  order_company_img:{data:Buffer,contentType:String}
});


const Ordermodel = mongoose.model('Ordermodel',schema2);

module.exports = Ordermodel;
