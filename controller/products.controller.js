const Product = require("../model/product.model.js");

// Get all products
const getProducts = async (req, res, next) => {
    try {
        const filter = {};

        // Filtering
        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.search) {
            filter.name = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sort = req.query.sort || "name";

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.status(200).json(products);

    } catch (err) {
        next(err);
    }
};

// Get product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (err) {
        next(err);
    }
};

// Create product
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (err) {
        next(err);
    }
};

// Update product
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (err) {
        next(err);
    }
};

// Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};

// Restock product
const restockProduct = async (req, res, next) => {
    try {
        const amount = Number(req.body.quantity);

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: amount } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (err) {
        next(err);
    }
};

// Sell product
const sellProduct = async (req, res, next) => {
    try {
        const amount = Number(req.body.quantity);

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: amount }
            },
            {
                $inc: { quantity: -amount }
            },
            { new: true }
        );

        if (!product) {
            return res.status(400).json({
                message: "Product not found or insufficient stock"
            });
        }

        res.status(200).json(product);

    } catch (err) {
        next(err);
    }
};

// Low stock report
const lowStockReport = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$lowStockLimit"]
            }
        });

        res.status(200).json(products);

    } catch (err) {
        next(err);
    }
};

// Category-wise inventory summary
const categoryReport = async (req, res, next) => {
    try {
        const report = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ]);

        res.status(200).json(report);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockReport,
    categoryReport
};