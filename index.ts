import express from "express";
import mongoose from "mongoose";

const app = express();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log("connected to the db");
  } catch (error) {
    console.log(error);
  }
};
connectMongo();
app.listen(3000, () => console.log(`server started on port 3000`));
