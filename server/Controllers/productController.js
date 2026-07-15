const asyncHandler = require('express-async-handler');
const prisma = require('../Utils/prisma');
const { serializeProduct } = require('../Utils/serializers');

const DEFAULT_IMAGE = 'https://placehold.co/600x400/000000/FFFFFF?text=Product+Image';

/**
 * @desc    Get all products
 * @route   GET /api/admin/products
 * @access  Public (listing) — writes below are admin-only
 */
const getProducts = asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(products.map(serializeProduct));
});

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private (Admin Only)
 */
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, imageUrls, sizes } = req.body;

    if (!name || !description || !price || !stock || !category) {
        res.status(400);
        throw new Error('Please include all required product fields.');
    }

    try {
        const product = await prisma.product.create({
            data: {
                userId: req.user._id, // from the 'protect' middleware
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                category,
                sizes: Array.isArray(sizes) ? sizes : [],
                imageUrls:
                    Array.isArray(imageUrls) && imageUrls.length > 0
                        ? imageUrls
                        : [DEFAULT_IMAGE],
            },
        });
        res.status(201).json(serializeProduct(product));
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400);
            throw new Error('A product with this name already exists.');
        }
        throw err;
    }
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin Only)
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, imageUrls, sizes } = req.body;

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined && price !== null) data.price = parseFloat(price);
    if (stock !== undefined && stock !== null) data.stock = parseInt(stock, 10);
    if (category !== undefined) data.category = category;
    if (Array.isArray(sizes)) data.sizes = sizes;
    if (Array.isArray(imageUrls)) data.imageUrls = imageUrls;

    try {
        const updated = await prisma.product.update({ where: { id: product.id }, data });
        res.status(200).json(serializeProduct(updated));
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400);
            throw new Error('A product with this name already exists.');
        }
        throw err;
    }
});

/**
 * @desc    Get a single product by ID (Public for detail view)
 * @route   GET /api/admin/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.status(200).json(serializeProduct(product));
});

/**
 * @desc    Get a single random product for the home page/discount showcase
 * @route   GET /api/products/random
 * @access  Public
 */
const getRandomProduct = asyncHandler(async (req, res) => {
    const count = await prisma.product.count();

    if (count === 0) {
        return res.status(200).json({ product: null, message: 'No products found.' });
    }

    const random = Math.floor(Math.random() * count);
    const [product] = await prisma.product.findMany({ skip: random, take: 1 });

    if (!product) {
        return res.status(200).json({ product: null, message: 'Could not retrieve a product.' });
    }

    res.status(200).json(serializeProduct(product));
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin Only)
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    try {
        await prisma.product.delete({ where: { id: product.id } });
    } catch (err) {
        if (err.code === 'P2003') {
            res.status(400);
            throw new Error('Cannot delete a product that is referenced by existing orders or carts.');
        }
        throw err;
    }

    res.status(200).json({ id: req.params.id, message: 'Product successfully removed.' });
});

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getRandomProduct,
    getProductById,
};
