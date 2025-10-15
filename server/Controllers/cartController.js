const asyncHandler = require('express-async-handler');
const Cart = require('../Models/cart');
const Product = require('../Models/product');
const mongoose = require('mongoose');


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
/**
 * @desc    Update quantity of an item in the cart
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const { itemId } = req.params;
    const userId = req.user._id;

    // 🔑 FIX 3: Validate itemId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400);
        throw new Error('Invalid Cart Item ID format.');
    }

    if (quantity === undefined || quantity < 1) {
        res.status(400);
        throw new Error('Quantity must be a positive number.');
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found.');
    }

    // Find the item by its sub-document _id (this relies on the ID being valid)
    const item = cart.items.id(itemId);

    if (!item) {
        res.status(404);
        // This is the error message being returned when ID is correct but not found
        throw new Error('Cart item not found.'); 
    }

    item.quantity = quantity;
    await cart.save();

    // Re-populate and return the updated cart items
    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');
    const totalItems = updatedCart.items.reduce((acc, currentItem) => acc + currentItem.quantity, 0);

    // 🔑 FIX 4: Ensure a JSON response is always sent on success
    res.status(200).json({
        message: 'Cart item updated.',
        items: updatedCart.items,
        totalItems: totalItems,
    });
});

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
const deleteCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;

    // 🔑 FIX 5: Validate itemId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400);
        throw new Error('Invalid Cart Item ID format.');
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found.');
    }

    const originalLength = cart.items.length;
    // Use pull to remove the sub-document by its _id
    cart.items.pull({ _id: itemId }); 

    if (cart.items.length === originalLength) {
         res.status(404);
         throw new Error('Cart item not found.');
    }

    await cart.save();

    // Re-populate and return the updated cart items
    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');
    const totalItems = updatedCart.items.reduce((acc, currentItem) => acc + currentItem.quantity, 0);

    // 🔑 FIX 6: Ensure a JSON response is always sent on success
    res.status(200).json({
        message: 'Cart item removed.',
        items: updatedCart.items,
        totalItems: totalItems,
    });
});

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem,
};
