import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { IncreaseScoreRequestBody, LoginRequestBody,  SignupRequestBody, TRAINING_TYPE } from "../types";
import { User } from "../model";
import { sendMail } from "../services/email";
import {
  IncreaseScoreRequestBody,
  LoginRequestBody,
  MODULE_TYPE,
  SignupRequestBody,
  TRAINING_TYPE,
} from "../app";
import { generateCertificate } from "../services/certificates";
import { DashboardData } from '../app';
require("dotenv").config();

const router = express.Router();

interface MyJWTPayload extends JwtPayload {
  userId: string;
}

router.post(
  "/api/signup",
  async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      // check what felids are not provided
      let i = 0;
      const requiredMessage = Object.keys({
        name,
        email,
        password,
      }).reduce((acc, curr, index) => {
        if (!req.body[curr as keyof SignupRequestBody]) {
          i++;
          acc += `${i}. ${curr.toUpperCase()}, `;
        }
        return acc;
      }, "Following fields are required:");

      if ( !name  || !email || !password) {
        return res.status(400).json({ message: requiredMessage });
      }

      // Check if the user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        realPassword: password,
      });

      // Save the user to the database
      await newUser.save();

      // Generate JWT for authentication
      const token = jwt.sign(
        { userId: newUser._id },
        `${process.env.JWT_TOKEN}`,
        { expiresIn: "20 days" }
      );

      // Return the JWT in the response
      return res.status(201).json({ token, id: newUser._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
);

router.post("/api/login", async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { email, password } = req.body as LoginRequestBody;

    console.log(req.body);

    // Validate request payload
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match
    if (passwordMatch) {
      // Generate JWT for authentication
      const token = jwt.sign({ userId: user._id }, `${process.env.JWT_TOKEN}`, {
        expiresIn: "20 days",
      });

      // Return the JWT in the response
      return res
        .status(200)
        .json({ token, id: user._id,  });
    } else {
      // If passwords don't match
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

const generateUsername = async (email: string) => {
  let username = "VRX-" + email.split("@")[0];
  let uniqueUsername = username;

  let counter = 1;

  while (await usernameExists(uniqueUsername)) {
    uniqueUsername = `${username}-${counter}`;
    counter++;
  }

  return uniqueUsername;
};

const usernameExists = async (username: string) => {
  const user = await User.findOne({ username });
  return user ? true : false;
};

router.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});





// router.get("/search",async  (req, res) => {
//     const query = req.query.q as string | undefined;
//     console.log(query);
  
//     if (!query) {
//       return res.status(400).json({ message: "Query is required." });
//     }
  
//     const url = new URL("https://www.googleapis.com/customsearch/v1");
  
//     url.searchParams.append("key", "AIzaSyCArdW91vTSFTn_VY9kGWB33MAclJ2D1wk");
//     url.searchParams.append("cx", "f0d9d837eefde47e9");
//     url.searchParams.append("q", query as string);
  
//     const response = await fetch(url.toString());
//     const result = (await response.json()) as { items: SearchResult[] };
  
//     const products = result.items.map((item) => {
//       return {
//         title: item.title,
//         link: item.link,
//         snippet: item.snippet,
//         image: item.image,
//       };
//     });
  
//     return res.status(200).json({ query, products });
//   });







export default router;
