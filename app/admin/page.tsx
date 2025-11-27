"use client";
import {
  assignUserToGraduationGroup,
  getGroups,
  getUsers,
} from "@/lib/getUsers";
import { useState, useEffect } from "react";
import Cardview from "./cardview";
import Navbar from "./navbar";
import Table from "./Table";
import { group } from "console";

function AdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"users" | "groups" | "group-members">(
    "users"
  );
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getUsers();
    const groupData = await getGroups();
    setUsers(data);
    setGroups(groupData);
    setLoading(false);
    // console.log("GROUPS FROM ADMIN:", groupData);
  }

  function handleGroupClick(groupId: string) {
    setSelectedGroup(groupId);
    setMode("group-members");
  }

  const totalUsers = users.length;
  const totalGroups = groups.length;

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <>
      <Navbar />
      <Cardview
        totalUsers={totalUsers}
        totalGroups={totalGroups}
        setMode={setMode}
      />
      <Table
        users={users}
        loadUsers={loadUsers}
        mode={mode}
        setMode={setMode}
        groups={groups}
        onGroupClick={handleGroupClick}
      />
    </>
  );
}

export default AdminUserPage;
