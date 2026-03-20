import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Email tidak terdaftar");

        // ← tambah cek ini
        if (!user.isVerified) {
          throw new Error("Email belum diverifikasi. Cek inbox kamu.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) throw new Error("Password salah");
        return { id: user._id.toString(), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
