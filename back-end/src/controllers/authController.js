const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findUserByEmail, findUserById } = require("../models/userModel");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await findUserByEmail(email);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const payload = {
      id: user.id,
      role_id: user.role_id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token: "Bearer " + token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserFromToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  loginUser,
  getUserFromToken,
};
