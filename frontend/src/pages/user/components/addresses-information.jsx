import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";

import { UserAddressModal } from "@/components/user-side-components/addresses/data-address-modal";
import { AddressCard } from "@/components/user-side-components/addresses/address-card";

import {
  useUserAddresses,
  useSetAddressAsDefault,
  useDeleteUserAddress,
} from "@/hooks/queries/user-addresses.query";

export function AddressesInformation() {
  const { data, isLoading, isError, error, refetch } = useUserAddresses();
  const setAddressAsDefault = useSetAddressAsDefault();

  const handleSetDefaultAddress = async (id) => {
    const { response } = await setAddressAsDefault(id);

    if (!response.ok) {
      toast.error("Gagal mengatur alamat default");
      return;
    }

    toast.success("Alamat default berhasil diatur");
  };

  const AddAddressDialogTrigger = () => (
    <Button size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Tambah Alamat
    </Button>
  );

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded mb-1 w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = ({ addresses }) => (
    <div className="space-y-4">
      {addresses.map((address) => {
        return (
          <AddressCard
            key={address.id}
            address={address}
            onSetDefault={handleSetDefaultAddress}
            isDeleteLoading={useDeleteUserAddress.isPending}
            isSetDefaultLoading={useSetAddressAsDefault.isPending}
          />
        );
      })}

      {data.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Belum ada alamat tersimpan</p>
          <p className="text-sm text-muted-foreground">
            Tambahkan alamat untuk memudahkan pengiriman
          </p>
        </div>
      )}
    </div>
  );

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman ({data.length})
          </CardTitle>
          <UserAddressModal
            triggerElement={AddAddressDialogTrigger()}
            onSuccess={refetch}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isError && (
          <div className="p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded">
            Error: {error.message}
          </div>
        )}

        {isLoading ? renderSkeleton() : renderContent({ addresses: data })}
      </CardContent>
    </Card>
  );
}
