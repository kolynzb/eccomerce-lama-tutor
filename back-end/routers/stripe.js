const router = require("express").route();
const stripe = require("stripe")(process.env.STRIPE_KEY);
require("dotenv/config");
router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: usd,
    },
    (stripeErr, stripeRes) => {
      stripeErr
        ? res.status(500).json(stripeErr)
        : res.status(500).json(stripeRes);
    }
  );
});
module.exports = router;
