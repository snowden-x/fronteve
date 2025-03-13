"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types";

export default function UsersPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Only admin should access this page
  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users Management</h1>
      <p className="text-muted-foreground">Manage system users and their permissions</p>
      
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a placeholder for the users list. In a real application, this would display a table of users with options to edit, delete, or change permissions.</p>
        </CardContent>
      </Card>
    </div>
  );
} 