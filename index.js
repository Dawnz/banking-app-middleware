require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.listen(PORT, ()=>{
    console.log('listening on port ', PORT);
})