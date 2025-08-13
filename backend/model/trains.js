import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({
  name: { type: String },
  trainno: { type: String, required: true, unique: true },
  stops: [
    {
      station: { type: String, required: true },
      distance: { type: Number, required: true },
      departure: { type: String, required: true }
    }
  ]
});

const Train = mongoose.model("Train", trainSchema, "trains"); // third arg = collection name
export default Train;
