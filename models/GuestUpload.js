import mongoose from "mongoose";

const GuestUploadSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  date: {
    type: String,
    required: true,
  },
});

// Index supaya query cepat
GuestUploadSchema.index({ ip: 1, date: 1 }, { unique: true });

export default mongoose.models.GuestUpload ||
  mongoose.model("GuestUpload", GuestUploadSchema);
