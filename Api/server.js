const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./Config/db')
const userRoutes = require('./Routes/userRoutes')

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/user', userRoutes)


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))   