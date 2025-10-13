const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware'); 
const { addToCart, getCart } = require('../Controllers/cartController');

console.log('protect:', typeof protect, 'addToCart:', typeof addToCart, 'getCart:', typeof getCart);

router
  .route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

module.exports = router;
