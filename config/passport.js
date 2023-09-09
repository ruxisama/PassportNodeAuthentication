const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/User');

module.exports = function(passport) {

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    //Match User
    User.findOne({ email: email })
      .then(user => {
        if(!user){
          return done(null, false, { message: 'That email is not registered'});
        }

        //Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect'});
          }
        });
      })
      .catch(err => console.log(err));
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

}