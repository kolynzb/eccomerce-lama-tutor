const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const { verifyTokenAndAdmin } = require("./verifyToken");
const Order = require("../models/Order");
const { verifyToken } = require("./verifyToken");

//create
router.post("/", verifyToken, (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedCart = await newOrder.save();
    res.status(500).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//put is for updating
router.put("/:id", verifyTokenAndAdOrder, async (req, res) => {
  //updating product
  try {
    //
    const updatedOrder = await Order.findbyIdAndUpdate(
      req.body.id,
      {
        $set: req.body, //sets it to the Product
      },
      { new: true }
    ); // tells it to set with new data)
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user cart

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.id });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findbyIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted....");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALLL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get monthly income
router.get("/income", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const lastMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previosMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" }, //assigns a number that corresponds to a month.For instatnce,it will assign 3 to march same goes for  $year
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
