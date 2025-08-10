import express from 'express'
import route from './routes/routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const whitelist = String(process.env.CORS_WHITELIST)
const corsOptions = {
  origin: function (origin, callback) {
    if (origin === whitelist) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use('/api', route)

const port = process.env.PORT
app.listen(port, () => {
  console.log('Server is running')
})