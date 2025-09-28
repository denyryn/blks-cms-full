import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useUserAddresses,
  useAddressActions,
  useIsDefaultAddress,
  useAddressOperationLoading,
} from "@/contexts/user-addresses.context";
import { Plus, Edit, Trash2, MapPin, Star, Loader2 } from "lucide-react";

export default function AddressManagementExample() {
  const {
    addresses,
    defaultAddress,
    loading,
    error,
    hasAddresses,
    addressCount,
  } = useUserAddresses();

  const { addAddress, editAddress, removeAddress, makeDefault, loadAddresses } =
    useAddressActions();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    recipient_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Indonesia",
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      label: "",
      recipient_name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Indonesia",
      is_default: false,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    console.log("Adding address:", formData);

    const result = await addAddress(formData);
    console.log("Add address result:", result);

    if (result.success) {
      setIsAddDialogOpen(false);
      resetForm();
      // You might want to show a success toast here
    } else {
      // Handle error - could show toast or error message
      console.error("Failed to add address:", result.error);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    console.log("Editing address:", { id: editingAddress.id, data: formData });

    const result = await editAddress(editingAddress.id, formData);
    console.log("Edit address result:", result);

    if (result.success) {
      setIsEditDialogOpen(false);
      setEditingAddress(null);
      resetForm();
      // You might want to show a success toast here
    } else {
      // Handle error
      console.error("Failed to edit address:", result.error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    console.log("Deleting address:", addressId);
    const result = await removeAddress(addressId);
    console.log("Delete address result:", result);

    if (!result.success) {
      console.error("Failed to delete address:", result.error);
      // Handle error
    }
  };

  const handleSetDefault = async (addressId) => {
    console.log("Setting default address:", addressId);
    const result = await makeDefault(addressId);
    console.log("Set default result:", result);

    if (!result.success) {
      console.error("Failed to set default address:", result.error);
      // Handle error
    }
  };

  const openEditDialog = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label || "",
      recipient_name: address.recipient_name || "",
      phone: address.phone || "",
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Indonesia",
      is_default: address.is_default || false,
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Management
              <Badge variant="secondary">{addressCount} addresses</Badge>
            </CardTitle>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Default Address Display */}
      {defaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Default Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressCard
              address={defaultAddress}
              isDefault={true}
              onEdit={() => openEditDialog(defaultAddress)}
              onDelete={() => handleDeleteAddress(defaultAddress.id)}
              onSetDefault={() => {}} // Already default
            />
          </CardContent>
        </Card>
      )}

      {/* All Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>All Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasAddresses ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No addresses found</p>
              <p className="text-sm">Add your first address to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isDefault={address.is_default}
                  onEdit={() => openEditDialog(address)}
                  onDelete={() => handleDeleteAddress(address.id)}
                  onSetDefault={() => handleSetDefault(address.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <AddressForm
              formData={formData}
              onChange={handleInputChange}
              isSubmitting={false}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditAddress} className="space-y-4">
            <AddressForm
              formData={formData}
              onChange={handleInputChange}
              isSubmitting={false}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Debug Info (Remove in production) */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Addresses:</strong> {hasAddresses ? "Yes" : "No"}
          </p>
          <p>
            <strong>Address Count:</strong> {addressCount}
          </p>
          <p>
            <strong>Default Address ID:</strong> {defaultAddress?.id || "None"}
          </p>
          <p>
            <strong>Error:</strong> {error || "None"}
          </p>
          <Button
            onClick={loadAddresses}
            size="sm"
            variant="outline"
            className="mt-2"
          >
            Refresh Addresses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Address Card Component
function AddressCard({ address, isDefault, onEdit, onDelete, onSetDefault }) {
  const isDeleteLoading = useAddressOperationLoading(address.id, "delete");
  const isDefaultLoading = useAddressOperationLoading(address.id, "default");

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{address.label}</h3>
            {isDefault && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
          <p className="font-medium">{address.recipient_name}</p>
          <p className="text-sm text-muted-foreground">{address.phone}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isDeleteLoading}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            {isDeleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          {address.address_line_1}
          {address.address_line_2 && (
            <>
              <br />
              {address.address_line_2}
            </>
          )}
        </p>
        <p>
          {address.city}, {address.state} {address.postal_code}
        </p>
        {address.country && (
          <p className="text-xs opacity-75">{address.country}</p>
        )}
      </div>

      {!isDefault && (
        <Button
          size="sm"
          variant="outline"
          onClick={onSetDefault}
          disabled={isDefaultLoading}
          className="w-full"
        >
          {isDefaultLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Setting as Default...
            </>
          ) : (
            <>
              <Star className="h-4 w-4 mr-2" />
              Set as Default
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// Address Form Component
function AddressForm({ formData, onChange, isSubmitting }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label">Address Label</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => onChange("label", e.target.value)}
          placeholder="e.g., Home, Office"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="recipient_name">Recipient Name</Label>
        <Input
          id="recipient_name"
          value={formData.recipient_name}
          onChange={(e) => onChange("recipient_name", e.target.value)}
          placeholder="Full name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+62 812-3456-7890"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="address_line_1">Street Address (Line 1)</Label>
        <Input
          id="address_line_1"
          value={formData.address_line_1}
          onChange={(e) => onChange("address_line_1", e.target.value)}
          placeholder="Street name, building number"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="address_line_2">
          Street Address (Line 2 - Optional)
        </Label>
        <Input
          id="address_line_2"
          value={formData.address_line_2}
          onChange={(e) => onChange("address_line_2", e.target.value)}
          placeholder="Additional address details"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="City"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="State"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            placeholder="12345"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_default"
          checked={formData.is_default}
          onChange={(e) => onChange("is_default", e.target.checked)}
          disabled={isSubmitting}
          className="rounded"
        />
        <Label htmlFor="is_default" className="text-sm">
          Set as default address
        </Label>
      </div>
    </div>
  );
}
