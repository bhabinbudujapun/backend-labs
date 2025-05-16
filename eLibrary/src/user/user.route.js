import express from "express";
import { loginUser, registerUser } from "./user.controller.js";

// Create a new router for user-related routes
const userRoute = express.Router();

// Route for registering a new user
// POST /api/users/register
userRoute.post("/register", registerUser);

// Route for logging in an existing user
// POST /api/users/login
userRoute.post("/login", loginUser);

// Export the router to be used in the main app
export default userRoute;
