// server/config/passport.js
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const User = require('../models/User');
const keys = require('./oauth');
const FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user with id:', id);
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error, null);
    }
  });

  passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        console.log('Creating new Google user');
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          profile: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
          },
          userType: 'customer'
        });
      }
      
      done(null, user);
    } catch (error) {
      console.error('Error in Google strategy:', error);
      done(error, null);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: keys.Facebook.clientSecret,
    callbackURL: keys.Facebook.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Facebook profile:', profile);
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        console.log('Creating new Facebook user');
        const names = profile.displayName.split(' ');
        user = await User.create({
          githubId: profile.id,
          email: profile.emails[0].value,
          profile: {
            firstName: names[0],
            lastName: names[1] || ''
          },
          userType: 'customer'
        });
      }
      
      done(null, user);
    } catch (error) {
      console.error('Error in Facebook strategy:', error);
      done(error, null);
    }
  }));
};