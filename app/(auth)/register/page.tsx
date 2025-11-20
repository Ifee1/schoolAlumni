"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signOut, auth } from "@/app/auth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Registration failed");
      return;
    }

    // 2️⃣ Log the user in after registration
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      toast.error(loginError.message);
      return;
    }

    toast.success("Welcome!");
    router.push("/");
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const res = await fetch("/api/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   const data = await res.json();

  //   if (res.ok) {
  //     toast.success("Sign In Successful");

  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });

  //     if (error) {
  //       console.error("Client sign-in error:", error.message);
  //       return;
  //     }

  //     console.log("Client sign-in success:", data);

  //     router.push("/");
  //   } else {
  //     toast.error("Sign In Failed");
  //   }
  // };
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CEDDF3]">
      <ToastContainer />
      <Card className="w-full max-w-sm mx-auto z-40 ">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Enter your email below</CardDescription>
          {/* <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign up
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Sign up with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export default RegisterPage;
function createClientComponentClient() {
  throw new Error("Function not implemented.");
}
