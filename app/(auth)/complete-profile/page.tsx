"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assignUserToGraduationGroup } from "@/lib/getUsers";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "react-toastify";

function CompleteProfile() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const years = Array.from(
    { length: new Date().getFullYear() - 1999 + 1 },
    (_, i) => 1999 + i
  );

  const router = useRouter();

  const handleCompleteProfile = async () => {
    if (!selectedYear) {
      toast.error("Please select your graduation year");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Unable to load user");
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ graduation_year: selectedYear })
      .eq("id", user.id);
    await assignUserToGraduationGroup(user.id, selectedYear);

    if (updateError) {
      console.error(updateError);
      toast.error("Failed to update profile");
      return;
    }

    toast.success("Profile completed!");

    router.push("/");
  };
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#53A2BE]/30">
      <Card className="w-full max-w-sm mx-auto z-40 px-4">
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="border border-gray-300 rounded-md align-center py-2 w-max"
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
                  className="bg-black/45 px-5 py-1.5 scroll-0"
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        <CardFooter className="flex-col gap-2 py-4">
          <Button
            type="submit"
            className="w-full"
            onClick={handleCompleteProfile}
            disabled={!selectedYear}
          >
            Complete your profile
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default CompleteProfile;
