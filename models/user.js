const mongoose=require("mongoose");

const user= new mongoose.Schema({

    username:{
            type:String,
            required:true,

        },
        email:{
            type:String,
            required:true,
            unique:true,

        },
        password:{
            type:String,
            required:true,
            unique:true,

        },
        adress:{
            type:String,
            required:true,

        },
        avatar:{
            type:String,
            default:"data:image/jpeg;base64,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"

        },
        roles:{
            type:String,
            default:"user",
            enum:["user","admin"],
        },
        favrites:[
            {type:mongoose.Types.ObjectId,
            ref:"books",},
        ],
        cart:[{
            type:mongoose.Types.ObjectId,
            ref:"books",
        }],
        orders:[{
            type:mongoose.Types.ObjectId,
            ref:"order",
        }],
        


},{timestamps:true})

module.exports=mongoose.model("User",user);