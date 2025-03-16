"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftIcon, 
  Loader2Icon, 
  UserPlusIcon, 
  TrashIcon,
  SearchIcon,
  UsersIcon
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { pharmaciesApi, Pharmacy, usersApi } from "@/lib/api";
import { User, UserRole } from "@/lib/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StaffManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableStaff, setAvailableStaff] = useState<User[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [addingStaff, setAddingStaff] = useState(false);
  const [removingStaffId, setRemovingStaffId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only admin should access this page
  if (user && user.role !== UserRole.PHARMACY_STAFF) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pharmacyData, staffData] = await Promise.all([
          pharmaciesApi.getPharmacy(parseInt(resolvedParams.id)),
          usersApi.getUsers({ role: "STAFF" }) // Changed to match backend expectation
        ]);
        setPharmacy(pharmacyData);
        const existingStaffIds = new Set(pharmacyData.staff?.map(s => s.id) || []);
        const availableStaffMembers = staffData.results.filter(s => !existingStaffIds.has(s.id));
        setAvailableStaff(availableStaffMembers);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load pharmacy and staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleAddStaff = async () => {
    if (selectedStaff.length === 0) {
      toast.error("Please select staff members to add");
      return;
    }

    try {
      setAddingStaff(true);
      
      // Add staff one by one and handle errors individually
      for (const staffId of selectedStaff) {
        try {
          await pharmaciesApi.addStaffToPharmacy(parseInt(resolvedParams.id), { user_id: staffId });
        } catch (error) {
          console.error(`Failed to add staff member ${staffId}:`, error);
          toast.error(`Failed to add one or more staff members`);
        }
      }
      
      // Refresh data regardless of individual failures
      const [updatedPharmacy, staffData] = await Promise.all([
        pharmaciesApi.getPharmacy(parseInt(resolvedParams.id)),
        usersApi.getUsers({ role: "STAFF" })
      ]);
      
      setPharmacy(updatedPharmacy);
      
      const existingStaffIds = new Set(updatedPharmacy.staff?.map(s => s.id) || []);
      const availableStaffMembers = staffData.results.filter(s => !existingStaffIds.has(s.id));
      setAvailableStaff(availableStaffMembers);
      
      toast.success("Staff members updated successfully");
      setSelectedStaff([]);
      setDialogOpen(false); // Close the dialog after successful addition
    } catch (error) {
      console.error("Failed to update staff:", error);
      toast.error("Failed to update staff members");
    } finally {
      setAddingStaff(false);
    }
  };

  const handleRemoveStaff = async (staffId: number) => {
    try {
      setRemovingStaffId(staffId);
      await pharmaciesApi.removeStaffFromPharmacy(parseInt(resolvedParams.id), { user_id: staffId });
      
      // Refresh pharmacy data
      const updatedPharmacy = await pharmaciesApi.getPharmacy(parseInt(resolvedParams.id));
      setPharmacy(updatedPharmacy);
      
      toast.success("Staff member removed successfully");
    } catch (error) {
      console.error("Failed to remove staff:", error);
      toast.error("Failed to remove staff member");
    } finally {
      setRemovingStaffId(null);
    }
  };

  const filteredAvailableStaff = availableStaff.filter(staff => 
    staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Pharmacy Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The requested pharmacy could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">{pharmacy.name}</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Members</DialogTitle>
              <DialogDescription>
                Select staff members to add to this pharmacy
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4">
                <SearchIcon className="h-4 w-4 opacity-50" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvailableStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(staff.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaff([...selectedStaff, staff.id]);
                              } else {
                                setSelectedStaff(selectedStaff.filter(id => id !== staff.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{staff.username}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                      </TableRow>
                    ))}
                    {filteredAvailableStaff.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No available staff members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddStaff}
                disabled={addingStaff || selectedStaff.length === 0}
              >
                {addingStaff && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Add Selected Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Staff Members</CardTitle>
          <CardDescription>
            Manage staff members assigned to this pharmacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pharmacy.staff && pharmacy.staff.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pharmacy.staff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.username}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <TrashIcon className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {staff.username} from this pharmacy?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveStaff(staff.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {removingStaffId === staff.id ? (
                                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                )}
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No staff members</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add staff members to this pharmacy using the button above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 