import Cart from "../models/cart.js";

/* ➕ ADD TO CART */
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity, image } = req.body;

    await Cart.create({
      user: req.user._id,
      productId,
      name,
      price,
      quantity,
      image
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Add to cart failed" });
  }
};

/* 📦 GET MY CART */
export const getMyCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id });
    res.json(cartItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

/* ❌ REMOVE ITEM */
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Remove failed" });
  }
};

/* 🔄 UPDATE QUANTITY */
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    await Cart.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { quantity }
    );

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* 🧹 CLEAR CART */
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Clear failed" });
  }
};
/* 📦 GET SINGLE CART ITEM */
export const getSingleCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Cart.findOne({
      _id: id,
      user: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load item" });
  }
};
