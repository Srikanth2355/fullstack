const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./Config/db')
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cookieParser = require('cookie-parser');
const { checkLoggedIn } = require('./Middlewares/checkLoggedIn')
const userRoutes = require('./Routes/userRoutes')
const noteRoutes = require('./Routes/noteRoutes')
const app = express()
const path = require("path");

app.set('trust proxy', 1);

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(mongoSanitize())
app.use(helmet())
app.use(cookieParser());


connectDB()

const limit = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: async (req,res)=>{
        const retryAfter = Math.ceil((req.rateLimit.resetTime - new Date()) / (60 * 1000)); // Remaining time in minutes
        res.status(429).json({
            success: false,
            message: `You have exhausted the number of hits. Please try again after ${retryAfter} minutes.`,
        });
    },
    standarHeaders: true,
    legacyHeaders: false,
    store: new rateLimit.MemoryStore()
});
app.use(limit);

app.use('/api/user', (req,res,next)=>{
    userRoutes(req,res,next)
})

app.use('/api/notes',checkLoggedIn, (req,res,next)=>{
    noteRoutes(req,res,next)
})

// Serve the static files from the React build folder
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// // Catch-all route to serve index.html for React Router
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
  });

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))   