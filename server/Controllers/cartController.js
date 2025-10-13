const asyncHandler = require('express-async-handler');
const Cart = require('../Models/cart');
const Product = require('../Models/product');


/**
 * @desc    Add a product to the cart or update quantity
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
    const { productId, size, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId || !size) {
        res.status(400);
        throw new Error('Please provide product ID and size.');
    }

    const productToAdd = await Product.findById(productId);

    if (!productToAdd) {
        res.status(404);
        throw new Error('Product not found.');
    }
    
    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if the item (product + size variant) is already in the cart
    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
        // Item exists: update quantity
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Item does not exist: add new item
        cart.items.push({
            product: productId,
            name: productToAdd.name,
            size: size,
            quantity: quantity,
            price: productToAdd.price,
        });
    }

    await cart.save();
    
    // Optionally return the whole updated cart
    res.status(201).json({ 
        message: `${productToAdd.name} (${size}) added to cart!`, 
        cart 
    });
});

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        return res.status(200).json({ items: [], totalItems: 0 });
    }

    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    res.status(200).json({
        items: cart.items,
        totalItems,
    });
});


module.exports = {
    addToCart,
    getCart,
};
