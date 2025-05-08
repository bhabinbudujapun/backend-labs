import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "./user.model.js";
import { sign } from "jsonwebtoken";

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
    const generateToken = sign({ sub: newUser._id }, "SECRET_KEY", {
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

export { registerUser };
