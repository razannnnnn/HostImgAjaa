import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowed = ["name", "role", "isVerified"];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, select: "-password -verificationToken -verificationExpiry" },
    );

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus akun sendiri" },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
