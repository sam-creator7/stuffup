const passport = require('passport');
const Googlestrategy =require('passport-google-oauth20');
require('dotenv').config();
const User = require('../model/google-user-model');

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
      done(null,user);
  });

});

passport.use(new Googlestrategy({
  //options for google strategy\
  callbackURL: '/auth/google/redirect',
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret
},(accessToken,refreshToken,profile,done) => {
    //passport call back funtion

    User.findOne({googleid: profile.id}).then((currentUser)=>{
      if (currentUser) {
        console.log(currentUser);
        done(null,currentUser);
      }
      else {
        new User({

          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email:profile.emails[0].value,
          googleid: profile.id,

        }).save().then((newUser)=>{
          done(null,newUser);
        });

      }
    })


})
)
