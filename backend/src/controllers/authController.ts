import { Request, Response, response } from 'express';
import bcrypt from 'bcrypt';
import User,{ IUser } from '../models/user';
import { generateTokenAndSetCookie } from "../utills/generateToken";

// Register User
export const register = async (req: Request, res: Response) => {
  try{
  const { fullName, username, email, phone, password, confirmPassword } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

    const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  if (isNaN(Number(phone))) {
    return res.status(400).json({ error: "Phone number must be a valid number" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName: fullName,
    username: username,
    email: email,
    phone:phone,
    password: hashedPassword
  });
  console.log(newUser)

  try {
    // Correct call with a single object parameter
    generateTokenAndSetCookie({ userId: newUser.id.toString(), res });

   await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch(e) {
    console.log((e as Error).message)
  }
}catch (error) {
  
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

