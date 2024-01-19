// types
import { Document } from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import router from "./routes/index";
require("dotenv").config();
// require('../db/connect')

const app = express();
const port = process.env.PORT || 3000;

import mongoose, { ObjectId } from "mongoose";
import searchRouter from "./routes/search";
import productRouter from "./routes/product";
// const dbUrl = process.env.DB_URL;

// if (dbUrl) {
//   const connectToMongoDB = async () => {
//     try {
//       await mongoose.connect(dbUrl, {});
//       console.log("Connected to MongoDB");
//     } catch (error) {
//       console.error("Failed to connect to MongoDB", error);
//     }
//   };

//   connectToMongoDB();
// } else {
//   console.error("DB_URL is undefined");
// }

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(router);
// app.use(searchRouter);
app.use(productRouter)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export type LoginRequestBody = {
  username: string;
  password: string;
};

export type SignupRequestBody = {
  email?: string;
  password?: string;
  name?: string;
  gender?: string;
  age?: number;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  username: string;
  realPassword: string; // 😜
  createdAt?: Date;
  updatedAt?: Date;
  training?: IGame[];
  certificates: mongoose.Types.ObjectId[];
}

export interface Certificate extends Document {
  html: string;
  pdf: Buffer;
}

export interface IGame {
  type: TRAINING_TYPE;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
  module: {
    type: MODULE_TYPE;
    score: number;
  }[];
}

export interface IncreaseScoreRequestBody {
  score: number;
  training: {
    type?: TRAINING_TYPE;
    moduleType?: MODULE_TYPE;
  };
}

export enum TRAINING_TYPE {
  CHEMICAL = "chemical",
  RADIOLOGICAL = "radiological",
  BIOLOGICAL = "biological",
  NUCLEAR = "nuclear",
}

export enum MODULE_TYPE {
  MODULE_1 = "module1",
  MODULE_2 = "module2",
  MODULE_3 = "module3",
  MODULE_4 = "module4",
  MODULE_5 = "module5",
  MODULE_6 = "module6",
}

export interface DashboardData {
  user:IUser,
  training: {
    type: TRAINING_TYPE;
    score: number;
  }[];
}
