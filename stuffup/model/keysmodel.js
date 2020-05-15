const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  google:{"clientID":String,"clientSecret":String},
  mongodb: {
    "dbURI": String
  },
    session:{
      "cookiekey": String
    },
    gmailpw:{
      "GMAILPW": String
    }
});

var Keysmodel = mongoose.model('Keys',schema);



module.exports = Keysmodel;
