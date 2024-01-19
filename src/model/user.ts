import { ObjectId } from "mongoose";
import { Schema, Document, model, Error } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../app";
import uid from "uid-safe";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  realPassword: {
    type: String,
    required: true,
  },
  pinned: {
    type: [
      {
        id: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
    required: false,
  },
});

// Hash the password before saving to the database
// userSchema.pre('save', async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

export const User = model<IUser>("User", userSchema);
