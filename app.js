var express = require('express');
const cors = require('cors');

var app = express();

var postRoute = require("./routes/postRoute"); 

app.use(cors({
    credentials: true,
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' 
}));

app.use(express.json());

app.use("/", postRoute);

module.exports = app;
