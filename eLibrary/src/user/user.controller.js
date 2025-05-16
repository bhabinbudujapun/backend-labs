import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "./user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// ===============================
// Register a New User
// ===============================
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Step 1: Validate request fields
  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required!"));
  }

  try {
    // Step 2: Check if the email is already registered
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(createHttpError(400, "Email is already in use!"));
    }

    // Step 3: Hash the user's password
    const hashPassword = await bcrypt.hash(password, 10);

    // Step 4: Create new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Step 5: Generate JWT token for the new user
    const token = jwt.sign({ sub: newUser._id }, config.secretKey, {
      expiresIn: "3d", // token valid for 3 days
    });

    // Step 6: Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: { name, email },
      accessToken: token,
    });
  } catch (error) {
    // Handle unexpected server errors
    return next(createHttpError(500, error.message || "Registration failed"));
  }
};

// ===============================
// Login an Existing User
// ===============================
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Step 1: Validate login fields
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required!"));
  }

  try {
    // Step 2: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "Invalid email or password!"));
    }

    // Step 3: Compare the entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid email or password!"));
    }

    // Step 4: Generate JWT token on successful login
    const token = jwt.sign({ sub: user._id }, config.secretKey, {
      expiresIn: "3d",
    });

    // Step 5: Send login success response
    res.json({
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    // Handle unexpected server errors
    return next(createHttpError(500, error.message || "Login failed"));
  }
};

export { registerUser, loginUser };
