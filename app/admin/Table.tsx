"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import RegisterPage from "../(auth)/register/page";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

type User = {
  role_id: number;
  id: string;
  first_name?: string;
  surname?: string;
  email?: string;
  role?: string;
  graduation_year: number;
};

export default function UserTable({
  users,
  loadUsers,
  mode,
  groups,
  setMode,
  onGroupClick,
}: {
  users: User[];
  groups: any[];
  mode: "users" | "groups" | "group-members";
  setMode: (value: "users" | "groups" | "group-members") => void;
  onGroupClick: (groupId: string) => void;

  loadUsers: () => void;
}) {
  const [editingUser, setEditingUser] = useState<any>(null);

  async function handleDeleteUser(id: string) {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
      return;
    }

    toast.success("User deleted");
    await loadUsers(); // refresh table
  }

  return (
    <div className="rounded-md border overflow-hidden p-6">
      {mode === "users" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firstname</TableHead>
              <TableHead>Surname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Graduation Year</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name ?? "—"}</TableCell>
                  <TableCell>{user.surname ?? "—"}</TableCell>
                  <TableCell>{user.email ?? "—"}</TableCell>
                  <TableCell>{user.graduation_year ?? "—"}</TableCell>
                  <TableCell>{user.role_id === 2 ? "admin" : "user"}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>

                    {/* <Button size="sm" variant="destructive">
                    Delete
                  </Button> */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {user.first_name}?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Confirm
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {mode === "groups" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Members</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <TableRow
                  key={group.id}
                  onClick={() => onGroupClick(group.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>{group.name ?? "—"}</TableCell>
                  <TableCell>{group.member_count ?? "-"}</TableCell>
                  <TableCell className="flex justify-end gap-2"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No Group found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information below</DialogDescription>
          </DialogHeader>

          <RegisterPage
            mode="edit"
            user={editingUser}
            onDone={() => {
              loadUsers();
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
