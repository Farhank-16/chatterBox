import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log("✅ DB Connected Successfully");

  } catch (error) {
    
    console.error("❌ DB Connection Error:", error.message);
  }
};

export default dbConnect;
 