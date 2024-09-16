import { Request, Response, Router } from "express";
import User from "../model/User";
import { loginUser, registerUser } from "../services/authService";
import { generateToken } from "../utils/jwtUtils";

const router = Router();

// register user route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email & password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User Already Exists!" });
    }
    const user = await registerUser(req.body);
    const token = generateToken(user);
    res
      .status(201)
      .json({ message: "User registered successfully", token, user: user });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: (error as Error).message,
    });
  }
});

// login user route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please provide name, email & password" });
    }

    const result = await loginUser(email, password);
    if (!result) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const { user, token } = result;
    res.json({
      message: "Login successful",
      token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: (error as Error).message,
    });
  }
});

export default router;
