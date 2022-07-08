const User = require('../models/user-model')
const axios = require('axios')
const bcrypt = require('bcryptjs')

exports.register_post = async (req, res) => {
    console.log(req.body)
    console.log(req.session)
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, password: hashedPassword })
    res.json({ 'status': 'ok' })
}

exports.watchlist_get = async (req, res) => {
    const { sessionId } = req.body
    const user = await User.findOne({ sessionId })
    console.log(user)
    const { watchlist } = user
    const animeList = []
    console.log(watchlist)

    const sleep = (ms) => {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    const getData = async (id) => {
        try {
            const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`).catch(err => console.log(id, err.message))
            await sleep(300)
            return res.data
        }
        catch (err) {
            console.log(err.message)
        }
    }

    for (let watchlistId of watchlist) {
        const res = await getData(watchlistId)
        animeList.push(res?.data)
    }
    console.log(animeList)
    res.json(animeList)
}

exports.login_post = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            console.log('matched!')
            console.log(user)
            const id = user._id
            const result = await User.find(id)
            console.log(result)
            req.session.userId = user.id
            console.log(req.session)
            res.cookie('session', req.session.id)
            return res.json({ 'status': 'ok' })
        }
    }
    return res.json({ 'status': 'error' })
}

exports.remove_watchlist = async (req, res) => {
    const { sessionId, animeId } = req.body
    const user = await User.findOne({ sessionId })
    const { watchlist } = user
    const newWatchlist = watchlist.filter(id => id !== animeId)
    user.watchlist = newWatchlist
    await user.save()
    console.log(user)
    res.json({ 'status': 'ok' })
}

exports.add_watchlist = async (req, res) => {
    const { animeId, sessionId } = req.body
    console.log(sessionId)
    const user = await User.findOne({ sessionId })
    console.log(user)
    // const user = await User.session(session).findOne()
    user.watchlist.push(animeId)
    await user.save()
    console.log(user)
    return res.json({ 'status': 'ok' })
}