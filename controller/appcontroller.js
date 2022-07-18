const User = require('../models/user-model')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const AnimeModel = require('../models/anime-model')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

exports.register_post = async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, password: hashedPassword })
    res.json({ 'status': 'ok' })
}

exports.logout_get = async (req, res) => {
    req.session.destroy()
    res.json({ 'status': 'ok' })
}

exports.login_post = async (req, res) => {

    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            req.session.userId = user.id
            return res.json({ 'status': 'ok' })
        }
    }
    return res.json({ 'status': 'error' })
}



exports.login_get = async (req, res) => {
    console.log('req session after', req.session)
    if (req.session.userId) {
        return res.json({ loggedIn: true, userId: req.session.userId })
    }
    else {
        res.send({ loggedIn: false })
    }
}

exports.watchlist_get = async (req, res) => {
    console.log('here')
    const userId = req.session.userId
    const user = await User.findById(userId).populate('watchlist')
    const watchlist = user.watchlist
    res.json({ watchlist })
}

exports.remove_watchlist = async (req, res) => {
    const { animeId } = req.body
    const userId = req.session.userId
    const user = await User.findById(userId)
    const anime = await AnimeModel.findOne({ animeId })
    user.watchlist = user.watchlist.filter(id => !anime._id.equals(id))
    await user.save()
    return res.json({ 'status': 'ok' })
}

exports.add_watchlist = async (req, res) => {
    const { animeId } = req.body
    console.log('animeId', animeId)
    const userId = req.session.userId
    const user = await User.findById(userId)
    console.log('user', user)
    let anime = await AnimeModel.findOne({ animeId })
    console.log(anime)
    if (!anime) {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/full`)
            .catch(err => console.log(animeId, err.message))
        if (res && res.data) {
            anime = await AnimeModel.create({ animeId, animeDetails: res.data })
        }
    }
    console.log("anime", anime)
    user.watchlist.push(anime.id)
    await user.save()
    return res.json({ 'status': 'ok' })
}