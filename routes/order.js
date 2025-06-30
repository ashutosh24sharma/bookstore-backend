const {authentication}=require("./user.auth");
const Book=require("../models/book")
const Order=require("../models/order");
const router=require("express").Router();
const User=require("../models/user")


router.post("/place-order",authentication,async (req,res)=>{
    try {

        const { id }=req.headers;
        const { order }=req.body;

        for(const orderData of order ){

            const  newOrder=new Order({user:id,book:orderData._id});
            const orderDatafromdb=await newOrder.save();

            //saving Order in user model

            await User.findByIdAndUpdate(id,{$push:{ orders:orderDatafromdb._id}});
            
            // clearing cart
            await User.findByIdAndUpdate(id,{
                $pull:{cart: orderData._id}
            })
        }

        return res.json({status:"success",message:"order place successfully"});
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});

//order history of particular user
router.get("/get-order-history",authentication,async (req,res)=>{
    try {

        const { id }=req.headers;
        const userData=await User.findById(id).populate({
            path:"orders",
            populate:{path:"book"},
            
            
        });
        

        const ordersData=userData.orders.reverse();
         return res.json({status:"success",data:ordersData});
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});

//get all orders----- admin

router.get("/get-all-orders",authentication,async (req,res)=>{
    try {

        const userData=await Order.find().populate({
            path:"books",
            
        }).populate({
            path:"user",
        }).sort({createdAt:-1});

         return res.json({status:"success",data:userData});
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }


});

//updated order----by admin
router.put("/update-status/:id",authentication,async (req,res)=>{
    try {

        const { id }=req.headers;
        const role=await User.findById(id);
        if( role.roles==="admin" ){
          await Order.findByIdAndUpdate(id,{status:req.body.status})
         return res.json({status:"success",message:"status updated successfully"});
        
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }


})

module.exports = router;