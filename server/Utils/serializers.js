// Serializers that shape Prisma rows into the Mongo-style JSON the React
// frontend already expects (notably `_id` instead of `id`, and the nested
// `shippingAddress` / `paymentResult` objects that used to be embedded docs).

const serializeUserPublic = (user) => {
  if (!user) return null;
  return { _id: user.id, name: user.name, email: user.email };
};

const serializeUser = (user) => {
  if (!user) return null;
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
};

const serializeProduct = (p) => {
  if (!p) return null;
  return {
    _id: p.id,
    user: p.userId,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    category: p.category,
    imageUrls: p.imageUrls,
    sizes: p.sizes,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

const serializeReview = (r) => {
  if (!r) return null;
  return {
    _id: r.id,
    // Populated when included, otherwise fall back to the raw id
    user: r.user ? serializeUserPublic(r.user) : r.userId,
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
};

const serializeLineItem = (item) => {
  if (!item) return null;
  return {
    _id: item.id,
    product: item.product ? serializeProduct(item.product) : item.productId,
    name: item.name,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  };
};

const serializeOrder = (o) => {
  if (!o) return null;
  return {
    _id: o.id,
    user: o.user ? serializeUserPublic(o.user) : o.userId,
    items: (o.items || []).map(serializeLineItem),
    shippingAddress: {
      address: o.shippingAddress,
      city: o.shippingCity,
      postalCode: o.shippingPostalCode,
      country: o.shippingCountry,
    },
    shippingMethod: o.shippingMethod,
    paymentMethod: o.paymentMethod,
    paymentResult: {
      id: o.paymentResultId,
      status: o.paymentResultStatus,
      update_time: o.paymentResultUpdateTime,
      email_address: o.paymentResultEmail,
    },
    paymentContact: o.paymentContact,
    paystackReference: o.paystackReference,
    itemsPrice: o.itemsPrice,
    taxPrice: o.taxPrice,
    shippingPrice: o.shippingPrice,
    totalPrice: o.totalPrice,
    isPaid: o.isPaid,
    paidAt: o.paidAt,
    isDelivered: o.isDelivered,
    deliveredAt: o.deliveredAt,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
};

module.exports = {
  serializeUserPublic,
  serializeUser,
  serializeProduct,
  serializeReview,
  serializeLineItem,
  serializeOrder,
};
