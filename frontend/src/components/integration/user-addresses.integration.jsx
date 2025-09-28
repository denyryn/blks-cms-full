/**
 * This file demonstrates how to integrate the UserAddresses context
 * into the existing user page by replacing hardcoded address data
 * with the context-based approach.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUserAddresses,
  useAddressActions,
  useAddressOperationLoading,
} from "@/contexts/user-addresses.context";
import { Edit, Trash2, Star, Plus, MapPin } from "lucide-react";

/**
 * Hook to replace the hardcoded addresses state in user page
 * This replaces the useState for addresses with context data
 */
export function useUserAddressesIntegration() {
  const {
    addresses,
    defaultAddress,
    loading,
    error,
    hasAddresses,
    addressCount,
  } = useUserAddresses();

  const { addAddress, editAddress, removeAddress, makeDefault } =
    useAddressActions();

  // Transform context data to match existing component expectations
  const transformedAddresses = addresses.map((addr) => ({
    id: addr.id,
    label: addr.label || "Address",
    recipientName: addr.recipient_name || "",
    phone: addr.phone || "",
    address: addr.address || "",
    city: addr.city || "",
    province: addr.province || "",
    postalCode: addr.postal_code || "",
    isDefault: addr.is_default || false,
  }));

  return {
    // State
    addresses: transformedAddresses,
    defaultAddress: defaultAddress
      ? {
          id: defaultAddress.id,
          label: defaultAddress.label || "Address",
          recipientName: defaultAddress.recipient_name || "",
          phone: defaultAddress.phone || "",
          address: defaultAddress.address || "",
          city: defaultAddress.city || "",
          province: defaultAddress.province || "",
          postalCode: defaultAddress.postal_code || "",
          isDefault: true,
        }
      : null,
    loading,
    error,
    hasAddresses,
    addressCount,

    // Actions
    handleAddAddress: async (addressData) => {
      const contextData = {
        label: addressData.label,
        recipient_name: addressData.recipientName,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.postalCode,
        is_default: addressData.isDefault,
      };
      return await addAddress(contextData);
    },

    handleEditAddress: async (addressId, addressData) => {
      const contextData = {
        label: addressData.label,
        recipient_name: addressData.recipientName,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.postalCode,
        is_default: addressData.isDefault,
      };
      return await editAddress(addressId, contextData);
    },

    handleDeleteAddress: async (addressId) => {
      return await removeAddress(addressId);
    },

    handleSetDefaultAddress: async (addressId) => {
      return await makeDefault(addressId);
    },
  };
}

/**
 * Simple Address List Component
 * This can replace the address section in the user page
 */
export function UserAddressList() {
  const {
    addresses,
    loading,
    error,
    hasAddresses,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useUserAddressesIntegration();

  const [isAddingAddress, setIsAddingAddress] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-200 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          My Addresses
        </h3>
        <Button
          onClick={() => setIsAddingAddress(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {!hasAddresses ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No addresses yet</p>
          <Button onClick={() => setIsAddingAddress(true)} className="mt-2">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              onDelete={() => handleDeleteAddress(address.id)}
              onSetDefault={() => handleSetDefaultAddress(address.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Address Item Component
 */
function AddressItem({ address, onDelete, onSetDefault }) {
  const isDeleteLoading = useAddressOperationLoading(address.id, "delete");
  const isDefaultLoading = useAddressOperationLoading(address.id, "default");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{address.label}</h4>
              {address.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">{address.recipientName}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.province} {address.postalCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              disabled={isDeleteLoading}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!address.isDefault && (
          <Button
            size="sm"
            variant="outline"
            onClick={onSetDefault}
            disabled={isDefaultLoading}
            className="mt-3 w-full"
          >
            {isDefaultLoading ? "Setting..." : "Set as Default"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Usage Instructions:
 *
 * 1. In your existing user page, replace the hardcoded addresses state:
 *
 *    // OLD:
 *    const [addresses, setAddresses] = useState([...]);
 *
 *    // NEW:
 *    const {
 *      addresses,
 *      loading,
 *      error,
 *      handleAddAddress,
 *      handleEditAddress,
 *      handleDeleteAddress,
 *      handleSetDefaultAddress,
 *    } = useUserAddressesIntegration();
 *
 * 2. Replace the address section JSX with:
 *    <UserAddressList />
 *
 * 3. Update your add/edit address handlers to use the context methods:
 *    - handleAddAddress(addressData) instead of local state updates
 *    - handleSetDefaultAddress(id) instead of local state updates
 *    - etc.
 */
