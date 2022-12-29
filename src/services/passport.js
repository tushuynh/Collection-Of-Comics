const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FaceStrategy = require('passport-facebook').Strategy;
const userSchema = require('../models/user')


passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        }, 
        async (accessToken, refreshToken, profile, done) => {
            let user = await userSchema.findOne({ username: profile._json.email})
            if (!user) {
                user = await userSchema.create({
                    name: profile._json.name,
                    username: profile._json.email,
                    password: '123123',
                    googleID: profile.id
                })
            }
            return done(null, user);
        }
    )
);

passport.use(
    new FaceStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await userSchema.findOne({ username: profile._json.email})
            if (!user) {
                user = await userSchema.create({
                    name: profile._json.name,
                    username: profile._json.email,
                    password: '123123',
                    facebookID: profile.id
                })
            }
            return done(null, user);
        }
    )
);