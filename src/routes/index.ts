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
      const { age, name, gender, email, password } = req.body;
      console.log(req.body);
      // check what felids are not provided
      let i = 0;
      const requiredMessage = Object.keys({
        age,
        name,
        gender,
        email,
        password,
      }).reduce((acc, curr, index) => {
        if (!req.body[curr as keyof SignupRequestBody]) {
          i++;
          acc += `${i}. ${curr.toUpperCase()}, `;
        }
        return acc;
      }, "Following fields are required:");

      if (!age || !name || !gender || !email || !password) {
        return res.status(400).json({ message: requiredMessage });
      }

      // Check if the user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const username = await generateUsername(email);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        age,
        name,
        gender,
        email,
        password: hashedPassword,
        username,
        realPassword: password,
        training: [],
        certificate: [],
      });

      // Save the user to the database
      await newUser.save();

      // Generate JWT for authentication
      const token = jwt.sign(
        { userId: newUser._id },
        `${process.env.JWT_TOKEN}`,
        { expiresIn: "20 days" }
      );
      const Email_HTML = `<div>Hello ${name},</div>\n\n<div>Welcome to VR RESCUES X! \n </div> <div>Thank you for signing up.</div>\n\nRegards,\nYour VR Rescue X Team,., Your username is <b> ${username} </b> `;
      const Email_Subject = "Welcome to VR Rescue X";

      sendMail(newUser, Email_HTML, Email_Subject, (err, info) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("info", info);
        }
      });

      // Return the JWT in the response
      return res.status(201).json({ token, id: newUser._id, username });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
);

router.post("/api/login", async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { username, password } = req.body as LoginRequestBody;

    console.log(req.body);

    // Validate request payload
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Check if the user with the provided email exists
    const user = await User.findOne({ username });

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
        .json({ token, id: user._id, username: user.username });
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

// API Route to Increase User Score
router.put(
  "/api/user/:id/score/",
  async (req: Request<{ id: string }, {}, IncreaseScoreRequestBody>, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const { training, score } = req.body;

      if (!training || !score) {
        return res
          .status(400)
          .json({ message: "Training and score are required." });
      }

      const { type, moduleType } = training;

      if (!type || !moduleType) {
        return res
          .status(400)
          .json({ message: "Training type and moduleType are required." });
      }

      if (!Object.values(MODULE_TYPE).includes(moduleType)) {
        return res.status(400).json({ message: "Invalid module type." });
      }

      if (!user.training) {
        user.training = [];
      }

      const index = user.training.findIndex((item) => item.type === type);
      if (index === -1) {
        user.training.push({
          type,
          score,
          module: [{ type: moduleType, score }],
        });
        console.log(user.training);
      } else {
        const moduleIndex = user.training[index].module.findIndex(
          (item) => item.type === moduleType
        );
        if (moduleIndex === -1) {
          user.training[index].module.push({ type: moduleType, score });
        } else {
          user.training[index].module[moduleIndex].score += score;
        }
        user.training[index].score += score;
      }

      await user.save();

      return res.status(200).json({ user, score });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
);



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
