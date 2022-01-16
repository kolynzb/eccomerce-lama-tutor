const router = require("express").Router();
const verifyToken = require("./verifyToken");
const verifyTokenAndAuthorization = require("./verifyTokenAuthorization");
const verifyTokenAndAdmin = require("./verifyTokenAdmin");
const User = require("../models/User");
//put is for updating
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    //encrpting new password
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  //updating user
  try {
    //
    const updatedUser = await User.findbyIdAndUpdate(
      req.params.id, //id
      {
        $set: req.body, //sets it to the user
      },
      { new: true }
    ); // tells it to return the new user )
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findbyId(req.params.id);
    //distructuring to get data
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findbyIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted....");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  //incase one add a query like /users/?new=true in the url
  //req.query.name of the query
  const query = req.query.new;
  try {
    //the query will get us the last 5 users
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5) //sort by   latest id
      : await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();

  const lastYear = new date(date.setFullYear(date.getFullYear() - 1)); //gets us today last year
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } }, //condition gte- greterthan      created at is in the user  object  that is returned by the db
      {
        $project: {
          month: { $month: "$createdAt" }, //assigns a number that corresponds to a month.For instatnce,it will assign 3 to march same goes for  $year
        },
      },
      {
        //groups then by there month
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
