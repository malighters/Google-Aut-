const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = express();
require('dotenv').config();
require('./auth');

const PORT = process.env.PORT || 5000;

const isLogged = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

app.set('view engine', 'ejs');
app.use(session({ secret: 'dogs', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure', (req, res) => {
    res.render('error');
})

app.get('/protected', isLogged, (req, res) => {
    res.render('protected');
})

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) next(err);
        req.session.destroy();
        res.send('Goodbye!');
    });
  });

app.listen(PORT, () => {
    console.log(`The server has been started on http://localhost:${PORT}`);
});