const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const axios = require('axios')
const appcontroller = require('./controller/appcontroller')
require('dotenv').config()
const PORT = process.env.PORT || 1200

console.log(process.env)

const store = new MongoDBStore({
    uri: 'mongodb+srv://tarun:tarun123@animelist.kb9t4.mongodb.net/?retryWrites=true&w=majority',
    collection: 'sessions'
})

const secret = 'this is a secret'
const checkLogin = (req, res, next) => {
    console.log(req.session)
    if (req.session.userId) {
        next()
    }
    else {

        return res.json({ path: '/user/login' })
    }
}

mongoose.connect('mongodb+srv://tarun:tarun123@animelist.kb9t4.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('connected to mongodb')
    app.listen(PORT, () => {
        console.log("listening to 1200")
    })
}).catch((err) => console.log(err))


app.use(cors({
    origin: process.env.CLIENT_LINK,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(express.json())
app.set("trust proxy", 1)

app.use(session({
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        // path: 'http://localhost:3000/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }
}))

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/users/register', appcontroller.register_post)

app.post('/users/login', appcontroller.login_post)


app.get('/users/watchlist', appcontroller.watchlist_get)

app.post('/remove/watchlist', appcontroller.remove_watchlist)

app.post('/add/watchlist', appcontroller.add_watchlist)
