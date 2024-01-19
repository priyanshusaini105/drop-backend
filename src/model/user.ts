import { ObjectId } from 'mongoose';
import { Schema, Document, model, Error } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../app';
import uid from 'uid-safe';



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
  age:{
    type: Number,
    required: true,
  },
  gender:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true,
  },
  training:{
    type: Array,
    required: false,
  },
  // ...

    certificates: [
      {
        _id: { type: String, required: true, default: uid(6,(err,str)=>{
          if(err){
            console.log(err);
            return Math.random().toString(36).substring(2, 6);
          }
          return str
        }) },
        html: { type: String, required: true },
        pdf: { type: Buffer, required: true },
      },
    ]
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

export const User = model<IUser>('User', userSchema);

