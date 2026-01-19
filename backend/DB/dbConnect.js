import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_CONNECT); // Debug
    if (!process.env.MONGODB_CONNECT) throw new Error("Mongo URI is missing in .env");

    await mongoose.connect(process.env.MONGODB_CONNECT,{
       useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    console.log("✅ DB Connected Successfully");

  } catch (error) {
    
    console.error("❌ DB Connection Error:", error.message);
    throw err;
  }
};

export default dbConnect;
 