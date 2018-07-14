const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const massive = require('massive')
const Auth0strategy = require('passport-auth0')
const fc = require('./controllers/foodController')

require('dotenv').config()

const app = express()

// Use CORS
app.use(cors());

// Saves information on the server
// based on the unique cookie id set in the browser
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser())

app.use(passport.initialize())
app.use(passport.session())

//add strategy for passport 
//add massive 
//Massive 
massive(process.env.CONNECTIONSTRING).then(dbInstance => {
  app.set('db', dbInstance)
})

//strategy
passport.use(new Auth0strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK,
  scope: 'openid profile email'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  let db = app.get('db');
  // console.log('user_Id', user_id)
  db.get_by_auth_id({auth_id: profile['user_id']}).then(user => {
    if(user.length) {
      console.log(1)
      return done(null, {id: user[0].id})
    } else {
      console.log(2)
      let { displayName: user_name, user_id: auth_id, emails } = profile;
      let email = emails[0].value;
      db.create_user({user_name, auth_id, email}).then( user => {
        return done(null, {id: user[0].id})
      })
    }
  })
}))

app.get('/me', (req, res) => {
  console.log('user', req.user);
  if (req.user) {
    res.send({
      name: req.user.user_name,
      email: req.user.email,
    })
  } else {
    res.sendStatus(401);
  }
})

//auth routes 
app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: 'http://localhost:3000/#/profile',
  failureRedirect: 'http://localhost:300/#/home'
})) 

passport.serializeUser((user, done) => {
  console.log('serialize user', user)
  done(null, {id: user.id})
})

passport.deserializeUser((user, done) => {
  console.log('user in deserialize', user)
  let db = app.get('db')
  db.get_session_user({id: user.id}).then( user => {
    console.log('user in getsession user', user)
    return done(null, user[0])
  })
})

//route 
app.get('/db/create', (req, res, next) => {
  let db = req.app.get('db')
  db.create_user_table().then( res => {
    console.log('res', res)
  })
})

//routes 
app.get('/api/food', fc.getFoodies)
app.post('/api/food', fc.postFood)

app.listen(3005, () => {
  console.log('listening on port 3005')
})