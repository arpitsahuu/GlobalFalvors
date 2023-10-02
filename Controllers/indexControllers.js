const upload = require("../helper/multer").single("avtar");
const Catupload = require("../helper/categorieMulter").single("Catimage");
const Proupload = require("../helper/productMulter").single("image");
const fs = require("fs");
const User = require("../models/userModels");
const Categorie = require("../models/categoriesSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderModels");
const Nodemailer = require("nodemailer");

const passport = require("passport");
const localStratagy = require("passport-local");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
passport.use(new localStratagy(User.authenticate()));

exports.home = async function (req, res, next) {
  try {
    const categoris = await Categorie.find({}).sort({ _id: -1 });
    res.render("index", { title: "Fooders", categoris });
  } catch (error) {
    res.status(404).json({ error: "An error occurred While loding Home page" });
  }
};

exports.usersignin = async function (req, res, next) {
  try {
    res.render("signin", { title: "Signin" });
  } catch (error) {
    res
      .status(404)
      .json({ error: "An error occurred While loding Signin page" });
  }
};

exports.usersignupget = async function (req, res, next) {
  try {
    res.render("signup", { title: "signup" });
  } catch (error) {
    res
      .status(404)
      .json({ error: "An error occurred While loding Signup page" });
  }
};

exports.usersignuppost = async function (req, res, next) {
  try {
    const { username, email, contact, password, address } = req.body;
    console.log(req.body)
    const exituser = await User.findOne({ username: username });
    console.log(exituser)
    if (exituser) {
      res
        .status(409)
        .json({ error: "User allready exits with this user name" });
    }
    if (!exituser) {
      console.log("jo")
      await User.register({ username, email, contact }, password)
        .then((user) => {
          res.redirect("/signin");
        })
        .catch((err) => res.send(err));
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

exports.userprofile = async function (req, res, next) {
  try {
    if (req.user.isAdmin) {
      return res.redirect("/adminProfile");
    }
    res.render("profile", {
      title: "Profile",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res
      .status(404)
      .json({ error: "An error occurred while loding Profile Page" });
  }
};

exports.userupload = async function (req, res, next) {
  try {
    try {
      if (req.file) {
        if (req.user.avatar !== "default.png") {
          fs.unlinkSync("./public/profileimages/" + req.user.avatar);
          console.log(req.file);
        }
        req.user.avatar = req.file.filename;
        req.user
          .save()
          .then(() => {
            // res.redirect("/update/" + req.user._id);
            res.redirect("/profile");
          })
          .catch((err) => {
            res.send(err);
          });
      }
    } catch (err) {
      res.send(err);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

exports.userupdateget = async function (req, res, next) {
  try {
    res.render("update", {
      title: "update",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res.status(404).json({
      error: "An error occurred while loding Update User Information Page",
    });
  }
};

exports.userupdatepost = async function (req, res, next) {
  try {
    const { username, contact, email } = req.body;
    console.log(username);
    console.log(req.user.id);

    const updateUserInfo = {};
    if (username !== "") {
      updateUserInfo.username = username;
    }
    if (contact !== "") {
      updateUserInfo.contact = contact;
    }
    if (email !== "") {
      updateUserInfo.email = email;
    }
    await User.findOneAndUpdate(req.user.id, updateUserInfo);
    res.redirect("/profile");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Updatind Your Information " });
  }
};

exports.userupdatepasswordget = async function (req, res, next) {
  try {
    res.render("updatepassword", {
      title: "Update password",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res
      .status(404)
      .json({ error: "An error occurred while loding Update Password page" });
  }
};

exports.userupdatepasswordpost = async function (req, res, next) {
  try {
    try {
      const user = await User.findById(req.params.id);
      await user.changePassword(req.body.oldpassword, req.body.newpassword);
      await user.save();
      res.redirect("/profile");
    } catch (erroe) {
      req.send(err);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Updating Password " });
  }
};

exports.usersignout = async function (req, res, next) {
  try {
    req.logout(() => {
      res.redirect("/signin");
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while Signout" });
  }
};

exports.productget = async function (req, res, next) {
  const name = req.params.name;
  try {
    const StarterPro = await Product.find({ categorie: name, type: "Starter" });
    const MainPro = await Product.find({
      categorie: name,
      type: "Main Course",
    });
    const DessertsPro = await Product.find({
      categorie: name,
      type: "Desserts",
    });
    // res.json(StarterPro)
    // console.log(name)
    // console.log(req.params.name)
    res.render("products", {
      title: "Products",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      StarterPro,
      MainPro,
      DessertsPro,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.usercard = async function (req, res, next) {
  try {
    res.render("cards", {
      title: "Card",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res.status(404).json({ error: "An error occurred while loding Card" });
  }
};

exports.userAddToCard = async function (req, res, next) {
  const id = req.params.id;
  try {
    const curproduct = await Product.findById(id);
    const user = req.user;
    const existingItem = user.card.items.find(
      (item) => item.product.toString() === id
    );

    if (existingItem) {
      return res.status(400).json({ message: "Product already in the cart" });
    }

    console.log(existingItem);
    const name = curproduct.name;
    const price = curproduct.rate;
    const image = curproduct.image;
    const product = curproduct.id;
    const newitem = {
      name,
      price,
      image,
      product,
    };
    console.log(newitem);
    user.card.items.push(newitem);
    await user.save();
    // return res.json({ message: 'Product added to cart' });
    return res.redirect("back");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Addding product to Card" });
  }
};

exports.userProduct = async function (req, res, next) {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    const user = req.user;

    res.render("product", {
      title: "Product",
      isLoggedIn: req.user ? true : false,
      user: user,
      product: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Addding product to Card" });
  }
};

exports.userdeleteitem = async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;

    const itemIndex = user.card.items.findIndex(
      (item) => item._id.toString() === id
    );

    if (itemIndex === -1) {
      // Item not found in the card.items array
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    user.card.items.splice(itemIndex, 1);

    await user.save();

    res.render("Cards", {
      title: "Card",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while Removing  product from Card" });
  }
};

exports.userincrementitem = async function (req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
    const user = req.user;
    console.log(user);
    const curproduct = await user.card.items.find(
      (item) => item._id.toString() === id
    );
    if (!curproduct) {
      return res.json({ message: "productr not found" });
    }
    console.log(curproduct);
    curproduct.quantity += 1;
    await user.save();
    res.render("Cards", {
      title: "Card",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userdecrementitem = async function (req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
    const user = req.user;
    console.log(user);
    const curproduct = await user.card.items.find(
      (item) => item._id.toString() === id
    );
    if (!curproduct) {
      return res.json({ message: "productr not found" });
    }
    if (curproduct.quantity <= 1) {
      return res.render("Cards", {
        title: "Card",
        isLoggedIn: req.user ? true : false,
        user: req.user,
      });
    }
    console.log(curproduct);
    curproduct.quantity -= 1;
    await user.save();
    res.render("Cards", {
      title: "Card",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createorderget = async function (req, res, next) {
  const id = req.params.id;
  try {
    const user = req.user;
    console.log(user);
    const curproduct = await user.card.items.find(
      (item) => item._id.toString() === id
    );
    if (!curproduct) {
      return res.json({ message: "productr not found" });
    }
    if (curproduct.quantity <= 1) {
      return res.render("Cards", {
        title: "Card",
        isLoggedIn: req.user ? true : false,
        user: req.user,
      });
    }
    console.log(curproduct);
    curproduct.quantity -= 1;
    await user.save();
    res.redirect("/chekouts/");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createorderpost = async function (req, res, next) {
  try {
    // Find the user by their ID
    console.log("post call");
    const userId = req.user;
    const user = await User.findById(userId);
    const gst = req.params.gst;
    const total = rew.params.total;
    // Copy the items from the card
    const copiedItems = [...user.card.items];

    // Create a new order using the copied items
    const newOrder = await Order.create({
      items: copiedItems,
      user: user._id,
      textPrice: gst,
      totalPrice: total,
      shippingInfo: {
        address: user.address,
        phoneNo: user.contact,
      },
    });

    // Push the new order to the user's orders array
    user.orders.push(newOrder.id);

    // Clear all items in the card
    user.card.items = [];

    // Save the updated user document
    await user.save();

    return res.json({ message: "Order created successfully" });
    // Handle any errors that occur during the process
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.userorder = async function (req, res, next) {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id });
    res.render("userOrder", {
      title: "Orders",
      isLoggedIn: req.user ? true : false,
      user: user,
      orders: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Lognign the page." });
  }
};

exports.userforgetpassword = async function (req, res, next) {
  try {
    res.render("forgetpassword", {
      title: "Forget password",
      isLoggedIn: req.user ? true : false,
    });
  } catch (error) {
    res.status(404).json({ error: "An error occurred while loding Card" });
  }
};

exports.usersendmailer = async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ message: "user not found with this email addres" });
    let code = `${Math.floor(Math.random() * 9000 + 1000)}`;

    //------ NODEMAILER

    const transport = Nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL_ADDRES,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: "Globel Flavors Pvt. Ltd.<arpitsahu358@gmil.com>",
      to: req.body.email,
      subject: "password reset link",
      text: "do not sherar this with anyone",
      html: `<p>Do not share this Code to anyone.</p><h1>${code}</h1>`,
    };

    transport.sendMail(mailOption, async (err, info) => {
      if (err) return res.send(err);

      await User.findByIdAndUpdate(user._id, { code });

      res.redirect("get-code/" + user._id);
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while Lognign the page." });
  }
};

exports.usergetcode = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.render("getcode", { title: "code", id: req.params.id, id:user._id , email:user.email });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

exports.usergetcodepost = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (user.code == req.body.code) {
      user.code = "";
      user.passwordresttoken = 1;
      await user.save();
      res.redirect("/change-password/" + user._id);
    } else {
      res.send("invalit code");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

exports.userchangepassword = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (user.passwordresttoken == "1") {
      res.render("changepassword", { title: "Change Password", id:user._id });
    } else {
      res.json({
        message: "you are not Authenticated to access Change password page.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          "An error you are not Authenticated to access Change password page.",
      });
  }
};

exports.userchangepasswordpost = async function (req, res, next) {
  try {
    let currentUser = await User.findOne({ _id: req.params.id });
    currentUser.setPassword(req.body.password, async (err, info) => {
      if (err) res.send(err);
      currentUser.passwordresttoken = 0;
      await currentUser.save();
      res.redirect("/signin");
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          "An error while updating the password.",
      });
  }
};
