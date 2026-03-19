import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/verify-failed", process.env.NEXTAUTH_URL),
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-failed", process.env.NEXTAUTH_URL),
      );
    }

    await User.updateOne(
      { _id: user._id },
      {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    );

    return NextResponse.redirect(
      new URL("/verify-success", process.env.NEXTAUTH_URL),
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(
      new URL("/verify-failed", process.env.NEXTAUTH_URL),
    );
  }
}
