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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type AuthCardProps = {
  mode?: "signup" | "edit";
  user?: {
    id: string;
    email: string;
    first_name: string;
    surname: string;
    role_id: number;
  };
  onDone?: () => void;
};

function RegisterPage({ mode = "signup", user, onDone }: AuthCardProps) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [roleId, setRoleId] = useState(user?.role_id ?? 1);
  const [password, setPassword] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const isDialog = mode === "edit";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          surname: surname,
          email,
          password,
          graduation_year: selectedYear,
        }),
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
    }

    if (mode === "edit") {
      const { error } = await supabase
        .from("users")
        .update({
          email,
          first_name: firstName,
          surname: surname,
          role_id: roleId,
        })
        .eq("id", user?.id);

      toast.success("User updated!");

      if (error) {
        console.error(error);
        return;
      }

      setTimeout(() => {
        if (onDone) onDone();
      }, 3000);
    }
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1999 + 1 },
    (_, i) => 1999 + i
  );

  return (
    // <section className="flex items-center justify-center min-h-screen bg-[#CEDDF3]">
    <section
      className={
        isDialog
          ? "" // inside Dialog → no fullscreen section
          : "flex items-center justify-center min-h-screen bg-[#CEDDF3]"
      }
    >
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Enter your data below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">FirstName</Label>
                <Input
                  type="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  type="surName"
                  placeholder="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
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

              {mode === "signup" && (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2 pt-5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="border border-gray-300 rounded-md align-center py-2 "
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center text-center"
                  >
                    {selectedYear ? selectedYear : "Select graduation year"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  {years.map((year) => (
                    <DropdownMenuItem
                      key={year}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardFooter className="flex-col gap-2 py-4">
              <Button type="submit" className="w-full">
                {mode === "signup" ? "Create an Account" : "Edit User"}
              </Button>
              {mode === "signup" && (
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGoogleSignIn}
                >
                  Sign up with Google
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export default RegisterPage;
