const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


//router
const urlRouter = require("./router/url");

dotenv.config();


mongoose.connect(process.env.MONGODB_URLS, {useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true}, () => {
    console.log("connected to mongodb");
});


app.use(express.json());
app.use(cors());
app.use("/api/url", urlRouter);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () =>{
    console.log("Backend server is  running ")
});