const { instance } = require("../app.js");
const Order = require("../models/orderModels");
const crypto = require("crypto");

exports.chekout = async function (req, res, next) {
  console.log(req.params.id);
  const id = req.params.id;
  const user = req.user;
  const Eorder = await Order.findById(id);
  console.log(Eorder);
  console.log(Eorder.totalPrice);

  let options = {
    amount: parseInt(Eorder.totalPrice) * 100,
    currency: "INR",
  };
  await instance.orders.create(options)
    .then(async (response) => {
      const razorpayKeyId = process.env.RAZORPAY_API_KEY;
      // Save orderId and other payment details
      Eorder.orderId = response.id;
      Eorder.amount = response.amount/100;
      Eorder.createdAt = response.created_at;
      Eorder.status = response.status;
      try {
        // Render Order Confirmation page if saved succesfully
        await Eorder.save();
        console.log(response)
        res.render("chackout", {
          title: "Confirm Order",
          razorpayKeyId: razorpayKeyId,
          paymentDetail: Eorder,
          user: user,
        });
      } catch (err) {
        // Throw err if failed to save
        if (err) throw err;
      }
    })
    .catch((err) => {
      // Throw err if failed to create order
      if (err) throw err;
    });
};

exports.paymentverify = async function (req, res, next) {

  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRAT)
    .update(body.toString())
    .digest("hex");

  // Compare the signatures
  if (expectedSignature === req.body.razorpay_signature) {
    // if same, then find the previosuly stored record using orderId,
    // and update paymentId and signature, and set status to paid.

    const compliteorder = await Order.findOneAndUpdate(
      { orderId: req.body.razorpay_order_id },
      {
        paymentId: req.body.razorpay_payment_id,
        signature: req.body.razorpay_signature,
        status: "paid",
        orderStatus: "Cooking"
      })
      const user = req.user
    //   ,{ new: true }, 
    console.log(compliteorder)
    await compliteorder.save();
    res.render("paymentSucces",{
      order:compliteorder, user: user
    });
      
  } else {
    res.render("pages/payment/fail", {
      title: "Payment verification failed",
    });
  }
};
