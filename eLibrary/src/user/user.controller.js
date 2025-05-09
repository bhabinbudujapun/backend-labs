import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "./user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// Register new users
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Valid input fields
  if (!name || !email || !password) {
    next(createHttpError(400, "All fields are required!"));
  }

  try {
    // Check if email already exists in DB
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(createHttpError(400, "Email is already in use!"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Password --> Hash
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser;
  try {
    newUser = await User.create({
      // Create new user
      name,
      email,
      password: hashPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  // Token generation JWT
  try {
    const generateToken = jwt.sign({ sub: newUser._id }, config.secretKey, {
      expiresIn: "3d",
    });

    res.status(201).json({
      // Respond with success message
      message: "User registered successfully",
      user: { name, email },
      accessToken: generateToken,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

// Login register user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    next(createHttpError(400, "All fields are required!!"));
  }

  // Find user by email
  const user = await User.findOne({ email });
  try {
    if (!user) {
      next(createHttpError(400, "User not found."));
    }
  } catch (error) {
    next(createHttpError(500, "Server error, please try again later."));
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  try {
    if (!isMatch) {
      return next(createHttpError(400, "Email or password incorrect!"));
    }
  } catch (error) {
    return next(createHttpError(500, "Server error, please try again later."));
  }

  try {
    // Generate JWT token
    const token = jwt.sign({ sub: user._id }, config.secretKey, {
      expiresIn: "3d",
    });

    // Send response
    res.json({ accessToken: token });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
