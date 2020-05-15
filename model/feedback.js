const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:String,
  email: {type:String, unique:false,required:false},
  feedback:String
});

var FeedbackModel = mongoose.model('Feedback',schema);

module.exports = FeedbackModel;
