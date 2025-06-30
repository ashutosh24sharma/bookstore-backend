const router=require("express").Router();
const User=require("../models/user")
const {authentication}=require("./user.auth");


//add book in cart
router.put("/add-to-cart",authentication,async (req,res)=>{
    try {
        
        const { bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isbookcart=userData.cart.includes(bookid);
        if(isbookcart){
            return res.status(200).json({message:"book id already in cart"});
        }
        await User.findByIdAndUpdate(id,{$push:{cart:bookid}});
        return res.status(200).json({message:"book added in cart"})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal error"})
    }
});

router.put("/remove-to-cart/:bookid",authentication,async (req,res)=>{
    try {
        
        const { bookid }=req.params;
        const {id}=req.headers;
        await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        
        
        return res.status(200).json({message:"book remove from  cart"})

    } catch (error) {
        console,log(error)
        res.status(500).json({error:"internal error"})
    }
})

router.get("/get-user-cart",authentication,async (req,res)=>{ 
    try {
          const {id}=req.headers;
          const userData=await User.findById(id).populate("cart");
          const cart=userData.cart.reverse();
          return res.json({status:"success",data:cart});
        
    } catch (error) {
        
        res.status(500).json({message:"internal server error"});
    }
});

module.exports=router; 