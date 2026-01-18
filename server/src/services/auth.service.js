import { findUserByEmail, createUser } from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";


export const registerUser = async (data) => {
  const { name, email, password } = data;

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // System decides role 
  const role = "user";

  // Create user
  const newUser = await createUser({
    name,
    email: normalizedEmail,
    password_hash,
    role
  });

  return newUser;
};



export const loginUser = async (data) => {
  const { email, password } = data;

  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = await findUserByEmail(normalizedEmail);

  // If user not found
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isCorrectPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT
  const token = jwt.sign(
    {
        userId: user.id,
        userRole: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
  )

  // Return safe response
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
