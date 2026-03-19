// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Image from "@/models/Image";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diupload" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung" },
        { status: 400 },
      );
    }

    // Validasi ukuran file (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB" },
        { status: 400 },
      );
    }

    // Convert file ke buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate nama file unik
    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;

    // Upload ke Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: `hostimgajaa/${filename}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // Generate delete code
    const deleteCode = uuidv4().replace(/-/g, "").substring(0, 16);

    // Simpan ke MongoDB
    const image = await Image.create({
      filename,
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      deleteCode,
      uploadedAt: new Date(),
    });

    // Return URL pakai domain sendiri
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const imageUrl = `${baseUrl}/api/i/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: image.filename,
      deleteCode: image.deleteCode,
      uploadedAt: image.uploadedAt,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload" },
      { status: 500 },
    );
  }
}
