const asyncHandler = require("express-async-handler");
const prisma = require("../Utils/prisma");
const { serializeOrder } = require("../Utils/serializers");
const { sendNewOrderNotification } = require("../Services/NotificationService");
const axios = require("axios");
const crypto = require("crypto");

// Paystack config
const PAYSTACK_API_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Include user + product details, matching the old .populate() calls.
const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: { include: { product: true } },
};

/**
 * Verify a transaction with Paystack.
 */
const verifyPaystackTransaction = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Paystack Verification Error:", error.response ? error.response.data : error.message);
    throw new Error("Paystack transaction verification failed.");
  }
};

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    shippingAddress,
    shippingMethod,
    paymentMethod,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    phone,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items found.");
  }

  const createdOrder = await prisma.order.create({
    data: {
      userId,
      shippingAddress: shippingAddress?.address,
      shippingCity: shippingAddress?.city,
      shippingPostalCode: shippingAddress?.postalCode,
      shippingCountry: shippingAddress?.country || "Kenya",
      shippingMethod,
      paymentMethod,
      paymentContact: phone,
      itemsPrice: itemsPrice ?? 0,
      taxPrice: taxPrice ?? 0,
      shippingPrice: shippingPrice ?? 0,
      totalPrice: totalPrice ?? 0,
      items: {
        create: items.map((item) => ({
          productId: item.product,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: orderInclude,
  });

  // Clear the user's cart (cascade removes its items)
  await prisma.cart.deleteMany({ where: { userId } });

  const serialized = serializeOrder(createdOrder);
  sendNewOrderNotification(serialized);

  res.status(201).json({
    message: "Order successfully placed.",
    order: serialized,
  });
});

/**
 * @desc    Update order with user's phone number for payment tracking
 * @route   PUT /api/orders/:id/payment-contact
 * @access  Private
 */
const updateOrderPaymentContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { phoneNumber } = req.body;
  const userId = req.user._id;

  if (!phoneNumber || phoneNumber.length < 9) {
    res.status(400);
    throw new Error("Valid phone number is required.");
  }

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.userId !== userId) {
    res.status(403);
    throw new Error("Not authorized to update this order.");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid.");
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { paymentContact: phoneNumber },
  });

  res.status(200).json({
    message: "Payment contact information saved successfully.",
    paymentContact: updated.paymentContact,
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.userId !== userId) {
    res.status(403);
    throw new Error("Not authorized to view this order.");
  }

  res.status(200).json(serializeOrder(order));
});

/**
 * @desc    Initialize Paystack transaction for an existing order
 * @route   POST /api/orders/:id/paystack-init
 * @access  Private
 */
const initializePaystackPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.userId !== userId) {
    res.status(403);
    throw new Error("Not authorized to pay for this order.");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid.");
  }

  const amountInSubunits = Math.round(order.totalPrice * 100);

  const paystackPayload = {
    email: order.user.email,
    amount: amountInSubunits,
    reference: order.id,
    metadata: {
      custom_fields: [
        {
          display_name: "Order ID",
          variable_name: "order_id",
          value: order.id,
        },
      ],
    },
    channels: ["card", "bank_transfer", "mobile_money"],
  };

  try {
    const { data: paystackResponse } = await axios.post(
      `${PAYSTACK_API_URL}/transaction/initialize`,
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (paystackResponse.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paystackReference: paystackResponse.data.reference },
      });

      res.status(200).json({
        authorization_url: paystackResponse.data.authorization_url,
        reference: paystackResponse.data.reference,
      });
    } else {
      res.status(400);
      throw new Error(`Paystack Initialization Failed: ${paystackResponse.message}`);
    }
  } catch (error) {
    console.error("Initialization Error:", error.response ? error.response.data : error.message);
    res.status(500);
    throw new Error("Failed to initialize payment with Paystack.");
  }
});

/**
 * @desc    Handle Paystack Webhook events (Payment Success)
 * @route   POST /api/orders/paystack-webhook
 * @access  Public (called by Paystack)
 */
const handlePaystackWebhook = asyncHandler(async (req, res) => {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    console.error("Paystack Webhook Signature Mismatch: Suspected unauthorized call.");
    return res.sendStatus(200);
  }

  const event = req.body;
  const { data, event: eventType } = event;

  if (eventType === "charge.success" && data.status === "success") {
    const paystackReference = data.reference;
    const orderId = data.metadata.custom_fields.find(
      (f) => f.variable_name === "order_id"
    )?.value;

    if (!orderId) {
      console.error(`Webhook Error: Order ID not found in metadata for ref ${paystackReference}`);
      return res.sendStatus(200);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (order && !order.isPaid) {
      const verification = await verifyPaystackTransaction(paystackReference);

      if (verification.status && verification.data.status === "success") {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            isPaid: true,
            paidAt: new Date(),
            paymentResultId: String(data.id),
            paymentResultStatus: data.status,
            paymentResultUpdateTime: data.paid_at,
            paymentResultEmail: data.customer.email,
          },
        });
        console.log(`Order ${orderId} successfully paid via Paystack.`);
      } else {
        console.error(`Webhook Error: Verification failed for Paystack ref ${paystackReference}`);
      }
    } else if (order && order.isPaid) {
      console.log(`Order ${orderId} already marked as paid. Skipping update.`);
    } else {
      console.error(`Order ${orderId} not found in database.`);
    }
  }

  res.sendStatus(200);
});

module.exports = {
  addOrderItems,
  updateOrderPaymentContact,
  getOrderById,
  handlePaystackWebhook,
  initializePaystackPayment,
};
