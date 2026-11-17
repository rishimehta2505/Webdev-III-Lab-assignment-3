const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();
const productRoutes = require("./routes/products.routes.js");
const errorHandler = require("./middleware/errorHandler.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/products", productRoutes);
app.use(errorHandler);

connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});