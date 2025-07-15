import express from 'express'
import route from './routes/routes.js'

const app = express()

app.use(express.json())

app.use('/api', route)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is running')
})