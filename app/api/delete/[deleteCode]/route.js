import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Image from "@/models/Image";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { deleteCode } = await params;

    // Cari gambar di MongoDB
    const image = await Image.findOne({ deleteCode });

    if (!image) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan atau kode salah" },
        { status: 404 },
      );
    }

    // Hapus dari Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Hapus dari MongoDB
    await Image.deleteOne({ deleteCode });

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil dihapus",
      filename: image.filename,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
