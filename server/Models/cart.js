const mongoose = require('mongoose');

// --- Corrected cartItemSchema ---
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
}, 
// Schema options are passed as the SECOND argument
{
    // The previous '{ _id: false }' is removed, so _id is automatically created.
    timestamps: true,
});

// --- Corrected cartSchema ---
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, 
// It's good practice to add timestamps to the parent schema too
{
    timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);