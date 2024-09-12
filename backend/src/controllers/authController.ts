import { Request, Response, response } from 'express';
import bcrypt from 'bcrypt';
import User,{ IUser } from '../models/user';
import { generateTokenAndSetCookie } from "../utills/generateToken";

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, phone, password, confirmPassword } = req.body;

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ error: "Full Name is required" });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({ email });
    console.log(email)
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Phone validation
    if (isNaN(Number(phone))) {
      return res.status(400).json({ error: "Phone number must be a valid number" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      fullName,
      username,
      email,
      phone,
      password: hashedPassword
    };

    // Save the new user
    const createdUser = await User.create(newUser);

    // Generate token and set cookie
    generateTokenAndSetCookie({ userId: createdUser.id.toString(), res });

    // Send success response
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error: any) {
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken` });
    }
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  
    generateTokenAndSetCookie({ userId: user.id.toString(), res });

    return res.status(200).json({ message: 'Success', user});

  } catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}

   res.status(200).json({ message: 'Login successful' });
};

export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
	const { fullName, email, username, phone } = req.body;

	const userEmail = req.params.email;
  console.log(userEmail)

	try {
		let user = await User.findOne({ email:userEmail });
		if (!user) return res.status(404).json({ message: "User not found" });

		user.fullName = fullName || user.fullName;
		user.username = username || user.username;
		user.email = email || user.email;
		user.phone = phone || user.phone;

		user = await user.save();

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

