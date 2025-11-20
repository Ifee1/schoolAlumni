import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
// import { supabaseServer } from "@/lib/superbaseServer";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.UPABASE_SERVICE_ROLE_KEY!,
  }),
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user }) {
      await fetch(`${process.env.NEXT_AUTH_URL}/api/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      return true; // allow sign in
    },
  },
});
