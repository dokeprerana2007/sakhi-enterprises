import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* SIGNUP */
export const signup = async (req, res) => {
  const { username, email, password, phone, address, visit_reason } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    phone,
    address,
    visit_reason
  });

  // ✅ Redirect to login page
  res.redirect("/login.html");
};

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Invalid credentials");

  // ✅ Store userId in cookie
  res.cookie("userId", user._id.toString(), {
    httpOnly: true
  });

  // ✅ Redirect to HOME page
  res.redirect("/index.html");
};

/* PROFILE */
export const profile = async (req, res) => {
  res.json(req.user);
};

//forgot pass
export const forgotPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_password } = req.body;

    // 1. Check fields
    if (!email || !new_password || !confirm_password) {
      return res.send("All fields are required");
    }

    // 2. Password match
    if (new_password !== confirm_password) {
      return res.send("Passwords do not match");
    }

    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("Email not registered");
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // 5. Update password
    user.password = hashedPassword;
    await user.save();

    // 6. Redirect to login
    res.redirect("/login.html");

  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

/* LOGOUT */
export const logout = (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login.html");
};