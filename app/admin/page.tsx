"use client";
import { getUsers } from "@/lib/getUsers";
import { useState, useEffect } from "react";
import Cardview from "./cardview";
import Navbar from "./navbar";
import Table from "./Table";

function AdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers(); // renamed load() → loadUsers()
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }

  // console.log("Users", users);
  const totalUsers = users.length;

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <>
      <Navbar />
      <Cardview totalUsers={totalUsers} />
      <Table users={users} loadUsers={loadUsers} />
    </>
  );
}

export default AdminUserPage;
