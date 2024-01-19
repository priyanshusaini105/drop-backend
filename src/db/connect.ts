import mongoose from "mongoose";
const dbUrl = process.env.DB_URL;

if (dbUrl) {
  const connectToMongoDB = async () => {
    try {
      await mongoose.connect(dbUrl, {});
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  };

  
  connectToMongoDB();
} else {
  console.error("DB_URL is undefined");
}