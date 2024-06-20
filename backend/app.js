const express = require("express")
const cors = require("cors")
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const config = require("./config.json");
const cookieParser = require("cookie-parser") // to get access of user cookies just by req.cookies

// configurations
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())


// mongo Connect
mongoose.connect(config.connectionString).then((data) => {
    console.log(`Connected to host ${data.connection.host}`)
})


// test api
app.get("/", (req, res) => {
    res.json({ data: "hello" });
})


const userRoute = require("./routes/userRoute")
const notesRoute = require("./routes/notesRoute")

app.use("/api", userRoute)
app.use("/api", notesRoute)


// server listening
app.listen(PORT, (err) => {
    if (err) console.log("Error in server setup")
    console.log(`Server Listening on Port ${PORT}`)
});

module.exports = app;