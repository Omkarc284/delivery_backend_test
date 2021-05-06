const express = require('express')
require('dotenv').config()
require('./db/mongoose')

const app = express()
const port = process.env.PORT
const dataRouter = require('./routers/Data')
app.use(express.json())
app.use(dataRouter)
module.exports = app





