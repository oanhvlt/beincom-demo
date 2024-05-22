import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('Mongodb connected');
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Mongodb connect successful!');
    return true;
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;