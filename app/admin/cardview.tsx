import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import React from "react";

function Cardview({
  totalUsers,
  totalGroups,
  setMode,
}: {
  totalUsers: any;
  totalGroups: any;
  setMode: (value: "users" | "groups") => void;
}) {
  return (
    <div className="flex justify-around items-center flex-wrap ">
      <Card
        className="w-full max-w-sm p-4 h-fit gap-4"
        onClick={() => setMode("users")}
      >
        <section className="flex justify-between items-center">
          <h3>Total users</h3>
          <Users size={30} color="#1446A0" strokeWidth={1.5} />
        </section>
        <h1 className="font-bold text-6xl">{totalUsers}</h1>
        <span>Registered Users</span>
      </Card>
      <Card
        className="w-full max-w-sm p-4 h-fit gap-4"
        onClick={() => setMode("groups")}
      >
        <section className="flex justify-between items-center">
          <h3>Total Groups</h3>
          <Users size={30} color="#1446A0" strokeWidth={1.5} />
        </section>
        <h1 className="font-bold text-6xl">{totalGroups}</h1>
        <span>Registered Users</span>
      </Card>
      <Card className="w-full max-w-sm p-4 h-fit gap-4">
        <section className="flex justify-between items-center">
          <h3>Newly Registered</h3>
          <Users size={30} color="#1446A0" strokeWidth={1.5} />
        </section>
        <h1 className="font-bold text-6xl">8</h1>
        <span>Registered Users</span>
      </Card>
    </div>
  );
}

export default Cardview;
