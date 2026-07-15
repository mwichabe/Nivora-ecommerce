const asyncHandler = require("express-async-handler");
const prisma = require("../Utils/prisma");
const { serializeReview } = require("../Utils/serializers");

// Include the review author's public fields (mirrors the old .populate('user', 'name email'))
const withUser = { user: { select: { id: true, name: true, email: true } } };

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
        include: withUser,
        orderBy: { createdAt: "desc" },
    });
    res.json(reviews.map(serializeReview));
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }
    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be between 1 and 5");
    }
    if (comment.length < 10) {
        res.status(400);
        throw new Error("Comment must be at least 10 characters long");
    }

    const review = await prisma.review.create({
        data: {
            userId: req.user._id,
            name: name.trim(),
            rating: parseInt(rating),
            comment: comment.trim(),
        },
        include: withUser,
    });

    res.status(201).json(serializeReview(review));
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const { name, rating, comment } = req.body;
    const reviewId = req.params.id;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    if (review.userId !== req.user._id) {
        res.status(403);
        throw new Error("Not authorized to update this review");
    }

    if (!name || !rating || !comment) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }
    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be between 1 and 5");
    }
    if (comment.length < 10) {
        res.status(400);
        throw new Error("Comment must be at least 10 characters long");
    }

    const updated = await prisma.review.update({
        where: { id: reviewId },
        data: {
            name: name.trim(),
            rating: parseInt(rating),
            comment: comment.trim(),
        },
        include: withUser,
    });

    res.json(serializeReview(updated));
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    // Owner or admin may delete
    if (review.userId !== req.user._id && !req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to delete this review");
    }

    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: "Review deleted successfully" });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
        where: { userId: req.user._id },
        orderBy: { createdAt: "desc" },
    });
    res.json(reviews.map(serializeReview));
});

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getMyReviews,
};
