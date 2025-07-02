const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
// Middleware
app.use(express.json());

// Setup session
app.use(session({
    secret: process.env.mySecretKey,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Replace with your credentials
passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:4000/auth/google/callback'
}, async(accessToken, refreshToken, profile, done) => {
    // Here, save user to DB or session
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    try {
        // check if user already exists by email
        const existingUser = await pool.query('SELECT * FROM sharma WHERE email = $1', [email]);

        if (existingUser.rows.length === 0) {
            // insert new user with only email
            const newUser = await pool.query(
                'INSERT INTO sharma (email) VALUES ($1) RETURNING *',
                [email]
            );
            return done(null, newUser.rows[0]);
        }

        return done(null, existingUser.rows[0]);
    } catch (err) {
        return done(err, null);
    }

}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google login route
app.get('/auth/google',
    passport.authenticate('google', {

        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect after login success
        console.log('User authenticated:', req.user);
        res.send("haa haa ho gyaa");
        // res.redirect('/dashboard'); // or send JWT/token here
    }
);


app.listen(4000, () => {
    console.log('✅ Server running at http://localhost:4000');
});
