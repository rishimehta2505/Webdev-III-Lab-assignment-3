const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockReport,
    categoryReport
} = require("../controller/products.controller.js");

const validateProduct = require("../middleware/validateProduct.js");

const router = express.Router();

// Reports
router.get("/reports/low-stock", lowStockReport);
router.get("/reports/category", categoryReport);

// Stock management
router.patch("/:id/restock", restockProduct);
router.patch("/:id/sell", sellProduct);

// CRUD operations
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;