"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftIcon, 
  Loader2Icon, 
  BuildingIcon, 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon,
  UsersIcon,
  PencilIcon
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { pharmaciesApi, Pharmacy } from "@/lib/api";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

export default function PharmacyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchPharmacy = async () => {
      try {
        setLoading(true);
        const data = await pharmaciesApi.getPharmacy(parseInt(resolvedParams.id));
        setPharmacy(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pharmacy:", err);
        setError("Failed to load pharmacy details");
        setPharmacy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, [resolvedParams.id]);

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
          <h1 className="text-3xl font-bold">Pharmacy Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/pharmacies/${resolvedParams.id}/staff`)}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Manage Staff
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/pharmacies/${resolvedParams.id}/edit`)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Pharmacy
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              General details about the pharmacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pharmacy.name}</p>
                  <p className="text-sm text-muted-foreground">Pharmacy Name</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pharmacy.address}</p>
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
              </div>
              <div>
                <Badge variant={pharmacy.is_active ? "default" : "secondary"}>
                  {pharmacy.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Contact details for the pharmacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pharmacy.contact_phone}</p>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pharmacy.contact_email}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              Staff members assigned to this pharmacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pharmacy.staff && pharmacy.staff.length > 0 ? (
              <div className="space-y-4">
                {pharmacy.staff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{staff.username}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                      </div>
                    </div>
                    <Badge>{staff.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No staff members assigned yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 