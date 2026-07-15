const prisma = require("../Utils/prisma");

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const addSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalized = email.toLowerCase().trim();

  if (!EMAIL_RE.test(normalized)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email: normalized } });

    if (existing) {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    const newSubscriber = await prisma.subscriber.create({ data: { email: normalized } });

    res.status(201).json({
      message: "Subscription successful! Welcome to the newsletter.",
      email: newSubscriber.email,
    });
  } catch (error) {
    console.error("Subscription error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    res.status(500).json({ message: "Server error during subscription" });
  }
};

module.exports = { addSubscriber };
