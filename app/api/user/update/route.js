import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let name, currentPassword, newPassword, profilePictureFile;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name");
      currentPassword = formData.get("currentPassword");
      newPassword = formData.get("newPassword");
      profilePictureFile = formData.get("profilePicture");
    } else {
      const body = await request.json();
      name = body.name;
      currentPassword = body.currentPassword;
      newPassword = body.newPassword;
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const updates = {};

    // Update nama
    if (name !== undefined && name !== null) {
      updates.name = name.trim();
    }

    // Update password
    if (currentPassword && newPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Password saat ini salah" },
          { status: 400 },
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password baru minimal 6 karakter" },
          { status: 400 },
        );
      }
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    // Update profile picture
    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validasi ukuran 2MB
      if (profilePictureFile.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran foto maksimal 2MB" },
          { status: 400 },
        );
      }

      // Validasi tipe
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(profilePictureFile.type)) {
        return NextResponse.json(
          { error: "Format foto harus JPG, PNG, atau WEBP" },
          { status: 400 },
        );
      }

      const bytes = await profilePictureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Hapus foto lama dari Cloudinary kalau ada
      if (user.profilePicture) {
        const publicId = `hostimgajaa/profiles/${session.user.email.split("@")[0]}`;
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }

      // Upload ke Cloudinary dengan resize 128x128
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `hostimgajaa/profiles/${session.user.email.split("@")[0]}`,
              resource_type: "image",
              transformation: [
                { width: 128, height: 128, crop: "fill", gravity: "face" },
              ],
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      updates.profilePicture = uploadResult.secure_url;
    }

    await User.updateOne({ email: session.user.email }, updates);

    const updatedUser = await User.findOne({ email: session.user.email });

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      user: {
        name: updatedUser.name,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
