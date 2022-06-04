// Server.js is the entry point in this project.

const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const routers = require("./routes/index.js");
const connectDatabase = require("./helpers/database/connectionDatabase.js"); 
const customErrorHandler = require("./middlewares/errors/customErrorHandler.js"); 

// Dotenv package configuration. The dotenv package gives us access to the .env file.
dotenv.config({
    path: "./env/config.env"
 });

// Database Connect
connectDatabase();

// Port
const PORT = 3000 || process.env.PORT;

//The app variable uses the Express package.
const app = express();

// "localhost:PORT/" endpoint
app.get('/', (req,res)=> {
    res.send("Stackoverflow back end clone with Node.js.");
});

// Middlewares
app.use(helmet());
app.use(morgan(common));
app.use(express.json()); // Express.js JSON parser middleware for "req.body" requests.
app.use(customErrorHandler); // Express.js custom error handler middleware.
app.use(express.static(path.join(__dirname, "public"))); // Static files.
app.use('/api', routers); // Route configuration.

// This function connects the server to a PORT.
app.listen(PORT, ()=>{
    console.log(`Server is running on localhost:${PORT}`)
});
