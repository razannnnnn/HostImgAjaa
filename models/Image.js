// models/Image.js
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  deleteCode: { type: String, required: true, unique: true },
  userId: { type: String, default: null }, // ← tambah ini
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
