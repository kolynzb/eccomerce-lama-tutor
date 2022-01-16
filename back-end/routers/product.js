const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const { verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/User");

router.post("/", verifyTokenAndAdmin, (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(500).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//put is for updating
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  //updating product
  try {
    //
    const updatedProduct = await Product.findbyIdAndUpdate(
      req.body.id,
      {
        $set: req.body, //sets it to the Product
      },
      { new: true }
    ); // tells it to set with new data)
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get product

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findbyId(req.params.id);
    //distructuring to get data
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findbyIdAndDelete(req.params.id);
    res.status(200).json("product has been deleted....");
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all products
router.get("/", async (req, res) => {
  //incase one add a query like /users/?new=true in the url
  //req.query.name of the query
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      //getting latest products
      products = await Products.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
