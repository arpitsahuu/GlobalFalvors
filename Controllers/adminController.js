const fs = require("fs");
const User = require("../models/userModels");
const Categorie = require("../models/categoriesSchema");
const Product = require("../models/productSchema");
const Catupload = require("../helper/categorieMulter").single("Catimage");
const Proupload = require("../helper/productMulter").single("image");
const Order = require("../models/orderModels")


exports.home = async function (req, res, next) {
    try {
      const categoris = await Categorie.find({}).sort({ _id: -1 });
      res.render("index", { title: "Fooders", categoris });
    } catch (error) {
      res.status(404).json({ error: "An error occurred While loding Home page" });
    }
};

exports.order = async function (req, res, next) {
  try {
    const user = req.user;
    const orders = await Order.find();
    res.render("Orders", {
      title: "Orders",
      isLoggedIn: req.user ? true : false,
      user: user, orders:orders
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.orderpaking = async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    order.orderStatus = "Paking"
    await order.save();
    return res.redirect("back");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.orderdelivering = async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    order.orderStatus = "Delivering"
    await order.save();
    return res.redirect("back");

  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.ordercomplite = async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    order.orderStatus = "Complited"
    await order.save();
    return res.redirect("back");

  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.adminedititems = async function (req, res, next) {
  try {
    const items = await Product.find();
    const user = req.user;
    res.render("edititems", {
      title: "Edit Products",
      isLoggedIn: req.user ? true : false,
      user: user, items:items
    });;

  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.adminedititemsform = async function (req, res, next) {
  try {
    const item = await Product.findById(req.params.id);
    const user = req.user;
    res.render("editform", {
      title: "Edit Products",
      isLoggedIn: req.user ? true : false,
      user: user, item:item
    });;

  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};

exports.adminedititemsformpost = async function (req, res, next) {
  try {
    await Product.findOneAndUpdate(req.params.id,req.body);
    res.status(200).redirect("/edit-item");

  } catch (error) {
    res.status(500).json({ error: "An error occurred while Lognign the page." });
  }
};