var express = require("express");
var router = express.Router();
const Upload = require("../helper/multer").single("avatar");
const Catupload = require("../helper/categorieMulter").single("Catimage");
const Proupload = require("../helper/productMulter").single("image");
const fs = require("fs");
const User = require("../models/userModels");
const Categorie = require("../models/categoriesSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderModels");

const passport = require("passport");
const localStratagy = require("passport-local");
passport.use(new localStratagy(User.authenticate()));

const nodemailer = require("nodemailer");
const { start } = require("repl");
const { createDiffieHellmanGroup, verify } = require("crypto");
const { home,
   usersignin,
   usersignupget,
   usersignuppost,
   userprofile,
   userupdateget,
   userupdatepost,
   userupdatepasswordget,
   userupdatepasswordpost,
   usersignout,
   productget,
   usercard,
   userAddToCard,
   userdeleteitem,
   userincrementitem,
   userdecrementitem,
   userProduct,
   userorder,
   userforgetpassword,
   usersendmailer,
   usergetcode,
   usergetcodepost,
   userchangepassword,
   userchangepasswordpost
} = require("../Controllers/indexControllers");
const { chekout, paymentverify } = require("../Controllers/paymentController");
const { order, orderpaking, orderdelivring, ordercomplite, orderdelivering, adminedititemsform, adminedititems, adminedititemsformpost } = require("../Controllers/adminController");


//------------------USER------------------
//keyid = rzp_test_qN2ZW9ayQgETQV
//keysecret = nhQio9PLfZfm0Ulfp7sTujcx
//nhQio9PLfZfm0Ulfp7sTujcx


/* GET home page. */
router.get("/", home);

router.post("/chekouts/:id", chekout);

router.post("/payment/verify", paymentverify)

/* GET drins page. */
// router.get("/drinks", function (req, res, next) {
//   res.render("drinks", { title: "Drinks" });
// });

/* GET drincs page. */
router.get("/signin", usersignin);

// POST signin route with passport.authentication 
router.post(
"/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
  }),
  function (req, res, next) {}
);

// GET signup page.
router.get("/signup",usersignupget);

// POST signup route .
router.post("/signup", usersignuppost);

// Get forgetpassword page.
router.get("/forgetpassword", userforgetpassword);

// POST route for send mail page.
router.post("/send-mail", usersendmailer);

// Get forgetpassword page.
router.get("/get-code/:id", usergetcode);

// POST  route for conform code.
router.post("/get-code/:id", usergetcodepost);

// POST  route for conform code.
router.get("/change-password/:id", userchangepassword);

// POST  route for conform code.
router.post("/change-password/:id", userchangepasswordpost);




 

// function isAdmin(req,res,next){
//   if(req.user.isadmin){
//     return next()
//   }
//   else{
//     res.redirect('/signin')
//   }
// }
/* GET profile page. */
router.get("/profile", isLoggedIn, userprofile); 

// POST Profile Photo Uplode route
router.post(
  "/upload",
  isLoggedIn,
  Upload,
  async function (req, res, next) {
    try {
      const user = req.user;
      console.log(req.file)
      if (req.file) {
        if (user.avatar !== "default.png") {
          fs.unlinkSync("./public/profileimages/" + req.user.avatar);
        }
        console.log(req.file);
        user.avatar = req.file.filename;
        console.log(req.file.filename)
        console.log(user)
        await user.save()
        res.redirect("/profile")
      }
    } catch (err) {
      res.send(err);
    }
  }
);

//Get user information update page 
router.get("/update", isLoggedIn, userupdateget);

// POST update user information.
router.post("/update/:id", isLoggedIn, userupdatepost);

// GET Updatepassword page.
router.get("/updatepassword", isLoggedIn, userupdatepasswordget );

// POST Updatepassword .
router.post("/updatepassword/:id",userupdatepasswordpost);

// GET Logout form website.
router.get("/logout", isLoggedIn, usersignout);

// GET Product page.
router.get("/products/:name", productget);

// GET Product page.
router.get("/product/:id", userProduct);

// GET Card Page.
router.get("/card",isLoggedIn, usercard);

// GET AddToCard .
router.get("/addToCard/:id",isLoggedIn, userAddToCard);

// GET  Remover item from Card
router.get('/deleteItem/:id',isLoggedIn,userdeleteitem);

// GET  increase item quentity in Card
router.get("/increment/:id",isLoggedIn, userincrementitem);

// GET  dectrese item quentity in Card
router.get("/decrement/:id",isLoggedIn, userdecrementitem);

// GET  dectrese item quentity in Card
router.get("/userOrder",isLoggedIn, userorder);



//-----------------Admin-----------------



// GEt Admin profile 
router.get("/adminProfile",isLoggedIn , isAdmin,  function (req, res, next) {
  res.render("adminProfile", { 
    title: "Admin Profile",
    isLoggedIn: req.user ? true : false,
    user:req.user
    });
});


router.get("/addCateg", async function (req, res, next) {
  const categories = await Categorie.find({});
  // respr.json(categories); 
  res.render("addCateg", {
    title: "Add Categorie",
    isLoggedIn: req.user ? true : false,
    user: req.user,categories
  });
});


router.post("/addCateg",Catupload, async function (req, res, next) {
  console.log(req.file)
  try{
    const {name,tagline} = req.body;
    if(!name || /^\s*$/.test(name) || !tagline){
      return res.status(400).json({ error: 'Invalid data' });
    }
    console.log(req.file.filename)
    const Catimage = req.file.filename;
    const categori =  await Categorie.create({
      name,
      tagline,
      Catimage
    })
    console.log(categori)
    await categori.save().then(() => {
      // res.redirect("/update/" + req.user._id);
      console.log(categori)
      res.redirect("/addCateg");
    })
    .catch((err) => {
      res.send(err);
    });
    
    
    // const chek = Categorie.findOne(categori) 
}
catch(error){
  console.log(error)
  res.send(error)
}
}
);

// router.post(
//   "/Cat-upload",
//   isLoggedIn,
//   Catupload,
//   async function (req, res, next) {
//     try {
//       if (req.file) {
//         req.categorie.Catimage = req.file.filename;
//         req.categorie
//           .save()
//           .then(() => {
//             // res.redirect("/update/" + req.user._id);
//             res.redirect("/addCateg");
//           })
//           .catch((err) => {
//             res.send(err);
//           });
//       }
//     } catch (err) {
//       res.send(err);
//     }
//   }
// );

router.get("/select-cat", isLoggedIn, function (req, res, next) {
  res.render("selectCat", {
    title: "Select Type",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/select-cat",isLoggedIn,async function (req, res, next) {
  try{
    const categorie =await Cat.findOne({categoriename: req.body.categoriename});
    if(!categorie) return res.send("Categorie not found");
    categorie.types.push(req.body.type);
    await categorie.save();
    res.redirect("/select-cat")
  } 
  catch(err){
    res.send(err);
  }
});

router.get("/add-type/:id", isLoggedIn, function (req, res, next) {
  res.render("addType", {
    title: "Select Type",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-type",isAdmin,async function (req, res, next) {
  try{
    req.categorie.types.push(req.body.type)
    if(!categorie) return res.send("Categorie not found")
    
  } 
  catch(err){
    res.send(err);
  }
});

router.get("/add-product", function (req, res, next) {

  res.render("addProduct", {
    title: "Add Product",
    isLoggedIn: req.user ? true : false,
    user: req.user
  });
});

router.post("/add-product",Proupload ,async function (req, res, next) {
  try{
    const {name,discription,rate,ingredients,categorie,type} = req.body;
    if(!name || !discription || !rate || !categorie || !type ){
      return res.status(400).json({ error: 'Invalid data' });
    }
    console.log(req.body)
    console.log(req.file.filename)
    const image = req.file.filename;
    
    const product = await Product.create({
      name,
      discription,
      rate,
      ingredients,
      categorie,
      type,
      image,
    });
     
    console.log(product)

    await product.save().then(() => {

      res.redirect("/add-product");
    })
    .catch((err) => {
      res.send(err);
    });

    
  } 
  catch(err){
    res.send(err);
  }
});





router.post('/create-order', async (req, res) => {
  try {
    const user = req.user;
    console.log(req.body.itemsPrice);
    console.log(req.body.totalPrice);
    console.log(req.body.textPrice);
    // Create a new order using the items in the card
    let totalprice = 0;
    const newOrder = user.card.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      product: item.product,
    }));
    console.log(newOrder)
    // Clear all items in the card
    user.card.items = [];
    const order = await Order.create({
      orderItems:newOrder,
      user:user.id,
      itemsPrice: req.body.itemsPrice ,
      textPrice:req.body.textPrice,
      shippingPrice:60,
      totalPrice:req.body.totalPrice,
      status:"Packaging",
      payment:"Unpaid"
    });
    console.log(order)
    if(user.address != ""){
      order.address = user.address
    }
    await user.save();
    res.status(200).redirect(307,`/chekouts/${order._id}`)
    // return res.json({ message: 'Order created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });

// router.post('/create-order', async (req, res) => {
//   try {
//     // Find the user by their ID
//     const userId = req.user;
//     const user = await User.findById(userId);
//     const gst = req.params.gst;
//     const total = res.params.total;
//     // Copy the items from the card
//     const copiedItems = [...user.card.items];
    
//     // Create a new order using the copied items
//     const newOrder = await Order.create({ items: copiedItems, user: user._id ,textPrice:gst,totalPrice:total });
    
//     // Push the new order to the user's orders array
//     user.orders.push(newOrder.id);
    
//     // Clear all items in the card
//     user.card.items = [];
    
//     // Save the updated user document
//     await user.save();
    
//     return res.json({ message: 'Order created successfully' });
//     // Handle any errors that occur during the process
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.post('/update-order/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    
    order.shippingInfo.address = req.body.address;
    order.shippingInfo.city = req.body.city;
    order.shippingInfo.state = req.body.state;
    order.shippingInfo.pinCode = req.body.pinCode;
    order.shippingInfo.phoneNo = req.body.phoneNo;

    await order.save();
    
    return res.json({ message: 'Order created successfully' });
    // Handle any errors that occur during the process
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/Orders",isLoggedIn,isAdmin, order);

router.get("/Orderpaking/:id",isLoggedIn,isAdmin, orderpaking);

router.get("/Orderdelivering/:id",isLoggedIn,isAdmin, orderdelivering);

router.get("/Ordercomplite/:id",isLoggedIn,isAdmin, ordercomplite);

router.get("/edit-item",isLoggedIn,isAdmin, adminedititems);

router.get("/edit-form/:id",isLoggedIn,isAdmin, adminedititemsform);

router.post("/edit-form/:id",isLoggedIn,isAdmin, adminedititemsformpost);












function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}


function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    next();
  } else {
    res.send("Not Authenticated person ");
  }
}


module.exports = router;
