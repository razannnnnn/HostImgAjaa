import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Image from "@/models/Image";
import GuestUpload from "@/models/GuestUpload";
import User from "@/models/User";

const GUEST_DAILY_LIMIT = 10;

export async function POST(request) {
  try {
    await connectDB();

    // Cek session
    const session = await getServerSession(authOptions);

    // Kalau belum login, cek limit berdasarkan IP
    if (!session) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      const today = new Date().toISOString().split("T")[0];

      // Cari record upload hari ini
      const guestRecord = await GuestUpload.findOne({ ip, date: today });

      if (guestRecord && guestRecord.count >= GUEST_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: `Batas upload harian tercapai (${GUEST_DAILY_LIMIT} foto/hari). Login untuk upload lebih banyak.`,
            limitReached: true,
          },
          { status: 429 },
        );
      }
    }

    const contentType = request.headers.get("content-type") || "";
    let buffer;
    let filename;

    if (contentType.includes("application/json")) {
      const { url } = await request.json();
      if (!url) {
        return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
      }
      const imageResponse = await fetch(url);
      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: "Gagal mengambil gambar dari URL" },
          { status: 400 },
        );
      }
      const mimeType =
        imageResponse.headers.get("content-type") || "image/jpeg";
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(mimeType)) {
        return NextResponse.json(
          { error: "URL bukan gambar yang valid" },
          { status: 400 },
        );
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      const ext = mimeType.split("/")[1].replace("jpeg", "jpg");
      filename = `${uuidv4()}.${ext}`;
    } else {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) {
        return NextResponse.json(
          { error: "Tidak ada file yang diupload" },
          { status: 400 },
        );
      }
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
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran file maksimal 10MB" },
          { status: 400 },
        );
      }
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      filename = `${uuidv4()}.${ext}`;
    }

    // Upload ke Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { public_id: `hostimgajaa/${filename}`, resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    const deleteCode = uuidv4().replace(/-/g, "").substring(0, 16);

    await Image.create({
      filename,
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      deleteCode,
      uploadedAt: new Date(),
      userId: session?.user?.id || null, // ← tambah ini
    });

    if (session?.user?.email) {
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $inc: { uploadCount: 1 } },
      );
    }

    // Update counter guest setelah upload berhasil
    if (!session) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";
      const today = new Date().toISOString().split("T")[0];

      await GuestUpload.findOneAndUpdate(
        { ip, date: today },
        { $inc: { count: 1 } },
        { upsert: true, new: true },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const imageUrl = `${baseUrl}/api/i/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      cloudinaryUrl: uploadResult.secure_url, // ← tambah ini
      filename,
      deleteCode,
      uploadedAt: new Date(),
      userId: session?.user?.id || null, // ← tambah ini
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload" },
      { status: 500 },
    );
  }
}
