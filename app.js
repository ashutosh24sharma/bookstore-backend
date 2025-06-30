const express=require("express");
const app=express();
const cors=require("cors");

const user = require("./models/user");
const Book=require("./routes/book")
const favirote=require("./routes/faviorate");
const cart=require("./routes/cart");
const order=require("./routes/order");



require("dotenv").config();
require('./connection/connection')
const User=require("./routes/user")

app.use(cors());
app.use(express.json());


app.use("/api/v1",User);
app.use("/api/v1",Book);
app.use("/api/v1",favirote)
app.use("/api/v1",cart);
app.use("/api/v1",order);




app.listen(process.env.PORT,()=>{
    console.log(`server started ${process.env.PORT}`);
})