const asyncHandler = require('express-async-handler');
const prisma = require('../Utils/prisma');
const { serializeLineItem } = require('../Utils/serializers');

// Fetch the user's cart with populated products and the owner's phone.
const getPopulatedCart = async (userId) => {
    return prisma.cart.findUnique({
        where: { userId },
        include: {
            user: { select: { phone: true, name: true, email: true } },
            items: { include: { product: true }, orderBy: { createdAt: 'asc' } },
        },
    });
};

// Shape the response the way the frontend expects.
const formatCartResponse = (cart) => {
    if (!cart) {
        return { items: [], totalItems: 0, userPhone: null };
    }
    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    return {
        items: cart.items.map(serializeLineItem),
        totalItems,
        userPhone: cart.user ? cart.user.phone : null,
    };
};

/**
 * @desc    Add a product to the cart or update quantity
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
    const { productId, size, quantity = 1, price } = req.body;
    const userId = req.user._id;

    if (!productId || !size || price === undefined) {
        res.status(400);
        throw new Error('Please provide product ID, size, and price.');
    }

    const productToAdd = await prisma.product.findUnique({ where: { id: productId } });

    if (!productToAdd) {
        res.status(404);
        throw new Error('Product not found.');
    }

    // ── Server-side price validation (unchanged logic) ──
    const FULL_PRICE = productToAdd.price;
    const DISCOUNT_RATE = 0.20;
    const EXPECTED_DISCOUNTED_PRICE = FULL_PRICE * (1 - DISCOUNT_RATE);

    const pricesToCheck = {
        full: parseFloat(FULL_PRICE.toFixed(2)),
        discounted: parseFloat(EXPECTED_DISCOUNTED_PRICE.toFixed(2)),
    };

    const clientPriceRounded = parseFloat(Number(price).toFixed(2));
    const isFullPrice = clientPriceRounded === pricesToCheck.full;
    const isDiscountedPrice = clientPriceRounded === pricesToCheck.discounted;

    let finalPrice;
    if (isFullPrice) {
        finalPrice = pricesToCheck.full;
    } else if (isDiscountedPrice) {
        finalPrice = pricesToCheck.discounted;
    } else {
        finalPrice = pricesToCheck.full;
        console.warn(
            `SECURITY WARNING: Price mismatch for product ${productId}. ` +
            `Client sent ${clientPriceRounded}. Neither full (${pricesToCheck.full}) nor discounted ` +
            `(${pricesToCheck.discounted}) price matched. Using server-calculated FULL price: ${finalPrice}`
        );
    }

    // Ensure a cart exists
    const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
    });

    // Is this product+size variant already in the cart?
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId, size },
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity, price: finalPrice },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                name: productToAdd.name,
                size,
                quantity,
                price: finalPrice,
            },
        });
    }

    const updatedCart = await getPopulatedCart(userId);

    res.status(201).json({
        message: `${productToAdd.name} (${size}) added to cart!`,
        ...formatCartResponse(updatedCart),
    });
});

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
    const cart = await getPopulatedCart(req.user._id);
    res.status(200).json(formatCartResponse(cart));
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

    if (quantity === undefined || quantity < 1) {
        res.status(400);
        throw new Error('Quantity must be a positive number.');
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found.');
    }

    // Ensure the item belongs to this user's cart
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) {
        res.status(404);
        throw new Error('Cart item not found.');
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

    const updatedCart = await getPopulatedCart(userId);
    res.status(200).json({
        message: 'Cart item updated.',
        ...formatCartResponse(updatedCart),
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

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found.');
    }

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) {
        res.status(404);
        throw new Error('Cart item not found.');
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await getPopulatedCart(userId);
    res.status(200).json({
        message: 'Cart item removed.',
        ...formatCartResponse(updatedCart),
    });
});

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem,
};
