import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Image from "@/models/Image";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { deleteCode } = await params;
    const image = await Image.findOne({ deleteCode });

    if (!image) {
      // Cek apakah request dari fetch (JSON) atau browser langsung
      const isJson = request.headers
        .get("accept")
        ?.includes("application/json");
      if (isJson)
        return NextResponse.json(
          { error: "Gambar tidak ditemukan" },
          { status: 404 },
        );
      return NextResponse.redirect(
        new URL("/deleteFailed", process.env.NEXTAUTH_URL),
      );
    }

    await cloudinary.uploader.destroy(image.publicId);
    await Image.deleteOne({ deleteCode });

    const isJson = request.headers.get("accept")?.includes("application/json");
    if (isJson) return NextResponse.json({ success: true });
    return NextResponse.redirect(
      new URL(
        `/deleteSuccess?filename=${image.filename}`,
        process.env.NEXTAUTH_URL,
      ),
    );
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
