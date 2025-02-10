const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./Config/db')
const userRoutes = require('./Routes/userRoutes')
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(mongoSanitize())
app.use(helmet())

connectDB()

const limit = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: async (req,res)=>{
        const retryAfter = Math.ceil((req.rateLimit.resetTime - new Date()) / (60 * 1000)); // Remaining time in minutes
        res.status(429).json({
            success: false,
            message: `You have exhausted the number of hits. Please try again after ${retryAfter} minutes.`,
        });
    },
    standarHeaders: 'draft-8',
    legacyHeaders: false,
    store: new rateLimit.MemoryStore()
});
app.use(limit);

app.use('/api/user', userRoutes)


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))   