import mongoose from "mongoose";
import { MY_DB_NAME } from "../utils/constant.js";

const dbConnect = async () => {
  try {
    const connectionDBinstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${MY_DB_NAME}`
    );
    console.log(`our DB is connect at ${connectionDBinstance.connection.host}`);
  } catch (error) {
    console.log("error occur during database connection" + error);
    process.exit(1);
  }
};

export { dbConnect };
