"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  SearchIcon, 
  MoreHorizontalIcon, 
  BuildingIcon, 
  Loader2Icon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlusCircleIcon
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { pharmaciesApi, Pharmacy } from "@/lib/api";
import { UserRole } from "@/lib/types";
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

export default function PharmaciesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Only admin should access this page
  if (user && user.role !== UserRole.PHARMACY_STAFF) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Fetch pharmacies from API
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        const filters: { search?: string; is_active?: boolean; page?: number } = { 
          search: searchQuery,
          page: currentPage
        };
        
        // Add status filter if needed
        if (statusFilter === "active") {
          filters.is_active = true;
        } else if (statusFilter === "inactive") {
          filters.is_active = false;
        }
        
        const response = await pharmaciesApi.getPharmacies(filters);
        setPharmacies(response.results);
        setTotalCount(response.count);
        
        // Calculate total pages
        const itemsPerPage = 10; // Assuming 10 items per page
        setTotalPages(Math.ceil(response.count / itemsPerPage));
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pharmacies:", err);
        setError("Failed to load pharmacies. Please try again.");
        setPharmacies([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchPharmacies();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, currentPage]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle pharmacy deletion
  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await pharmaciesApi.deletePharmacy(id);
      toast.success("Pharmacy deleted successfully");
      
      // Refresh the list
      const filters: { search?: string; is_active?: boolean; page?: number } = { 
        search: searchQuery,
        page: currentPage
      };
      
      if (statusFilter === "active") {
        filters.is_active = true;
      } else if (statusFilter === "inactive") {
        filters.is_active = false;
      }
      
      const response = await pharmaciesApi.getPharmacies(filters);
      setPharmacies(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Failed to delete pharmacy:", error);
      toast.error("Failed to delete pharmacy");
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pharmacies Management</h1>
        <Button onClick={() => router.push("/dashboard/pharmacies/new")}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Pharmacy
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pharmacy List</CardTitle>
          <CardDescription>
            Manage all registered pharmacies in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <SearchIcon className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search pharmacies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select 
                defaultValue="all" 
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pharmacies</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-destructive/15 p-4 mb-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="h-8 w-8 animate-spin mr-2" />
              <span>Loading pharmacies...</span>
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BuildingIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pharmacies found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacies.map((pharmacy) => (
                      <TableRow key={pharmacy.id}>
                        <TableCell className="font-medium">{pharmacy.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{pharmacy.contact_email}</span>
                            <span className="text-muted-foreground text-sm">{pharmacy.contact_phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pharmacy.address}</TableCell>
                        <TableCell>
                          <Badge variant={pharmacy.is_active ? "default" : "secondary"}>
                            {pharmacy.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pharmacy.staff?.length || 0} members</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/pharmacies/${pharmacy.id}`)}
                              >
                                <BuildingIcon className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/pharmacies/${pharmacy.id}/edit`)}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit Pharmacy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/pharmacies/${pharmacy.id}/staff`)}
                              >
                                <UsersIcon className="mr-2 h-4 w-4" />
                                Manage Staff
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete Pharmacy
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      pharmacy and remove it from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(pharmacy.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {deletingId === pharmacy.id ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {pharmacies.length} of {totalCount} pharmacies
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 