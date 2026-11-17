const validateProduct = (req, res, next) => {

    const { name, category, price, quantity } = req.body;

    if (req.method === "POST") {

        if (!name || !category ||
            price === undefined || quantity === undefined) {

            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }
    }

    if (price !== undefined && Number(price) < 0) {
        return res.status(400).json({
            message: "Price cannot be negative"
        });
    }

    if (quantity !== undefined && Number(quantity) < 0) {
        return res.status(400).json({
            message: "Quantity cannot be negative"
        });
    }

    next();
};

module.exports = validateProduct;