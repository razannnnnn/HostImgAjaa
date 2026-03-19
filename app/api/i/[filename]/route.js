// app/api/i/[filename]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "@/models/Image";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { filename } = await params;

    // Cari gambar di MongoDB
    const image = await Image.findOne({ filename });

    if (!image) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan" },
        { status: 404 },
      );
    }

    // Fetch gambar dari Cloudinary
    const response = await fetch(image.cloudinaryUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil gambar" },
        { status: 500 },
      );
    }

    // Stream gambar ke user
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
