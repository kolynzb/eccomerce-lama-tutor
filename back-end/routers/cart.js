const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const { verifyTokenAndAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");
const { verifyToken } = require("./verifyToken");

//create
router.post("/", verifyToken, (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(500).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//put is for updating
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //updating product
  try {
    //
    const updatedCart = await Cart.findbyIdAndUpdate(
      req.body.id,
      {
        $set: req.body, //sets it to the Product
      },
      { new: true }
    ); // tells it to set with new data)
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user cart

router.get("/find/:userid", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findbyIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted....");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALLL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
