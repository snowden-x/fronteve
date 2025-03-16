"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { pharmaciesApi, Pharmacy } from "@/lib/api";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

export default function EditPharmacyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pharmacy>({
    id: parseInt(resolvedParams.id),
    name: "",
    address: "",
    contact_phone: "",
    contact_email: "",
    is_active: true,
    staff: [],
    created_at: "",
    updated_at: ""
  });

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
        setFormData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pharmacy:", err);
        setError("Failed to load pharmacy details");
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await pharmaciesApi.updatePharmacy(formData.id, formData);
      toast.success("Pharmacy updated successfully");
      router.push(`/dashboard/pharmacies/${resolvedParams.id}`);
    } catch (error) {
      console.error("Failed to update pharmacy:", error);
      toast.error("Failed to update pharmacy");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

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
        <h1 className="text-3xl font-bold">Edit Pharmacy</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pharmacy Information</CardTitle>
          <CardDescription>
            Update the pharmacy details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Pharmacy Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter pharmacy name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter pharmacy address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="Enter contact phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="Enter contact email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 