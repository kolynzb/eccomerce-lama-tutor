const route = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//register
route.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    //.save saves to db
    const savedUser = await newUser.save();
    //200 is succesful and 201 is successfully added
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.post("/login", async (req, res) => {
  try {
    // searching for the user in the db
    //findOne finds  one user the satisfys the querys
    const user = await User.findOne({ username: req.body.username });
    //checking if the user exists
    !user && res.status(401).json("wrong user credentials!");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OrigPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    //checking if password is correct

    OrigPassword !== req.body.password &&
      res.status(401).json("wrong password credentials!");

    //adding jwt for authorization
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    //distructuring to get data
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
