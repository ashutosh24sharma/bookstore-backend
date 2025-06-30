const mongoose=require('mongoose');
require("dotenv").config();


mongoose.connect(process.env.URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

 const db=mongoose.connection;

 db.on('connected',()=>{
    console.log('serverv connected')
 });
 db.on('disconnected',()=>{
    console.log('serverv disconnected')
 });

 db.on('error',(err)=>{
    console.error('serverv connected',err)
 });

 module.exports=db;