const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const axios = require('axios')

const appcontroller = require('./controller/appcontroller')
const app = express()
const User = require('./models/user-model')
const AnimeModel = require('./models/anime-model')
require('dotenv').config()
const PORT = process.env.PORT || 1200

const store = new MongoDBStore({
    uri: 'mongodb+srv://tarun:tarun123@animelist.kb9t4.mongodb.net/?retryWrites=true&w=majority',
    collection: 'sessions'
})

const secret = 'this is a secret'

mongoose.connect('mongodb+srv://tarun:tarun123@animelist.kb9t4.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('connected to mongodb')
    app.listen(PORT, () => {
        console.log("listening to 1200")
    })
}).catch((err) => console.log(err))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use(cors({
    origin: process.env.CLIENT_LINK,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("trust proxy", 1)

app.use(session({
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false,
        sameSite: "lax",
    }
}))

app.post('/users/register', appcontroller.register_post)

app.post('/users/login', appcontroller.login_post)

app.get('/users/login', appcontroller.login_get)

app.get('/users/logout', appcontroller.logout_get)

app.get('/users/watchlist', appcontroller.watchlist_get)

app.post('/remove/watchlist', appcontroller.remove_watchlist)

app.post('/add/watchlist', appcontroller.add_watchlist)
