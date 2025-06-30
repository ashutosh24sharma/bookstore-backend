const router=require("express").Router();
const User=require("../models/user")
const {authentication}=require("./user.auth");


//add book in favirotes
router.put("/add-book-in-favi",authentication,async (req,res)=>{
    try {
        
        const { bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isbookfavi=userData.favrites.includes(bookid);
        if(isbookfavi){
            return res.status(200).json({message:"book id already in favourites"})
        }
        await User.findByIdAndUpdate(id,{$push:{favrites:bookid}});
        return res.status(200).json({message:"book added in favourites"})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal error"})
    }
})

router.put("/remove-book-from-favi",authentication,async (req,res)=>{
    try {
        
        const { bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isbookfavi=userData.favrites.includes(bookid);
        if(isbookfavi){
            await User.findByIdAndUpdate(id,{$pull:{favrites:bookid}});
        }
        
        return res.status(200).json({message:"book remove from  favourites"})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal error"})
    }
})

router.get("/get-favi-book",authentication,async (req,res)=>{ 
    try {
          const {id}=req.headers;
          const userData=await User.findById(id).populate("favrites");
          const faviroteBooks=userData.favrites;
          return res.json({status:"success",data:faviroteBooks});
        
    } catch (error) {
        console.log("error is",error)
        res.status(500).json({message:"internal server error"});
    }
});

module.exports=router;