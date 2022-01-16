const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routers/user");
const authRoute = require("./routers/auth");
const productRoute = require("./routers/product");
const cartRoute = require("./routers/cart");
const orderRoute = require("./routers/order");
require("dotenv/config");
//initialize app
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json()); //parses data to json
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/product", cartRoute);
app.use("/api/product", orderRoute);

//connection to DB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//ROUTES
app.get("/api", (req, res) => {
  res.send("your test connection is working ");
});
//start server
app.listen(port, () => console.log(`Server running on port ${port}`));
