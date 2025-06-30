const router=require("express").Router();
const User=require("../models/user")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {authentication}=require("./user.auth");
//sign up
 
router.post("/sign-up",async (req,res)=>{
    try {
        
        const {username,email,password,adress}= req.body;

        //check user name length is more than 3.
        if(username.length<4){
            return res.status(400).json({message:"username name must be greater than 3"});
        }

        //check user name already exsist or not

        const userexsist=await User.findOne({username:username});
        if(userexsist){
            return res.status(400).json({message:"user name alreay exists"});
        }

         //check user name already exsist or not

         const emailexsist=await User.findOne({email:email});
         if(emailexsist){
             return res.status(400).json({message:"email alreay exists"});
         }

          //check posword length is more than 5.
        if(password.length<=5){
            return res.status(400).json({message:"pasword should be greater than 5"});
        }
       //pasword hashing
       const hashpass=await bcrypt.hash(password,10);

        //user create
         const newUser=new User({
            username:username,
            email:email,
            password:hashpass,
            adress:adress
         });

         await newUser.save();
         return res.status(200).json({message:"sign up created succesfully 🎉"})


    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal error"})
    }
})

router.post("/sign-in",async (req,res)=>{
    try {
          const {username,password}=req.body;

          const userexsists=await User.findOne({username});

          if(!userexsists){
            res.status(400).json({message:"invalid details"})
          }
        
          await bcrypt.compare(password,userexsists.password,(err,data)=>{
            if(data){
                      
                const authclaims=[
                    {name:userexsists.username},
                    {role:userexsists.roles}
                 
                ]

                const token=jwt.sign({authclaims},"bookstore123",{expiresIn:"30d"},)
                res.status(200).json({id:userexsists._id,roles:userexsists.roles,token:token});

            }else{
                res.status(400).json({message:"invalid details"})
            }
          })

    } catch (error) {
        
        res.status(500).json({error:"internal error"})
    }
})

router.get("/get-user-information",authentication,async (req,res)=>{
    try {
        
         const {id}=req.headers;
         const data=await User.findById(id).select("-password");
         return res.status(200).json(data);


    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});

//update address
router.put("/update-adress",authentication,async (req,res)=>{
    try {
        
         const {id}=req.headers;
        const {adress}=req.body;
        await User.findByIdAndUpdate(id,{adress:adress})
         return res.status(200).json({message:"address updated succesfully"});


    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});



module.exports=router;



