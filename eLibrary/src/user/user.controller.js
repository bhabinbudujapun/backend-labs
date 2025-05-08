import createHttpError from "http-errors";

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    next(createHttpError(400, "All fields are required!"));
  }

  res.status(200).json({
    message: "User registered successfully",
    user: { name, email },
  });
};

export { registerUser };
