const router=require("express").Router();
const User=require("../models/user")
const jwt=require("jsonwebtoken");
const {authentication}=require("./user.auth");
const Book=require("../models/book")

//add book admin
router.post("/add-book",authentication,async (req,res)=>{
    try {
            const {id}=req.headers;
            const user=await User.findById(id);
            if(user.roles !=="admin"){
                 return   res.status(500).json({message:"you are not having access to performs admin work "});
            }


        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language

        });
        await book.save();
        res.status(200).json({message:"book added succesfully"})

        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
})

router.put("/update-book",authentication,async (req,res)=>{
    try {
            const {bookid}=req.headers;
            await Book.findByIdAndUpdate(bookid,{
                url:req.body.url,
                title:req.body.title,
                author:req.body.author,
                price:req.body.price,
                desc:req.body.desc,
                language:req.body.language
    
            });
          
            return  res.status(200).json({message:"book updated succesfully"});

        
    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});

router.delete("/delete-book",authentication,async (req,res)=>{
    try {
            const {bookid}=req.headers;
            await Book.findByIdAndDelete(bookid)
               
          
            return  res.status(200).json({message:"book deleted succesfully"});

        
    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});

router.get("/get-all-book",async (req,res)=>{
    try {
          
        const books=await Book.find().sort({createdAt: -1});
        return res.json({status:"sucess",data:books}); 

    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});

router.get("/recent-all-book",async (req,res)=>{
    try {
          
        const books=await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({status:"sucess",data:books}); 

    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});
     
router.get("/get-book-by-id:id",async (req,res)=>{ 
    try {
          const {id}=req.params;
          const book=await Book.findById(id);
          return res.json({status:"success",data:book});
        
    } catch (error) {
        console.log("error is",error)
        res.status(500).json({message:"internal server error"});
    }
});



module.exports=router;