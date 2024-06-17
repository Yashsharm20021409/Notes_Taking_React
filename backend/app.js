const express = require("express")
const cors = require("cors")
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const config = require("./config.json");


// configurations
app.use(express.json());
app.use(cors({
    origin:"*",
}));


// mongo Connect
mongoose.connect(config.connectionString).then((data)=>{
    console.log(`Connected to host ${data.connection.host}`)
})


// test api
app.get("/",(req,res)=>{
    res.json({data:"hello"});
})


// server listening
app.listen(PORT,(err)=>{
    if (err) console.log("Error in server setup")
    console.log(`Server Listening on Port ${PORT}`)
});

module.exports = app;