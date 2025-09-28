import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Star, Check } from "lucide-react";
import { UserAddressModal } from "@/components/user-side-components/addresses/data-address-modal";
import { useUserAddresses } from "@/hooks/queries/user-addresses.query";

export function AddressSelector({ selectedAddressId, onAddressSelect }) {
  const { data: addresses = [], isLoading, error } = useUserAddresses();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Automatically select default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        onAddressSelect(defaultAddress);
      } else {
        // If no default address, select the first one
        onAddressSelect(addresses[0]);
      }
    }
  }, [addresses, selectedAddressId, onAddressSelect]);

  const AddAddressButton = () => (
    <Button variant="outline" size="sm" className="w-full">
      <Plus className="h-4 w-4 mr-2" />
      Tambah Alamat Baru
    </Button>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">
              Gagal memuat alamat: {error.message}
            </p>
            <UserAddressModal
              triggerElement={<AddAddressButton />}
              isOpen={isAddModalOpen}
              setIsOpen={setIsAddModalOpen}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">
              Belum ada alamat tersimpan
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Tambahkan alamat pengiriman untuk melanjutkan checkout
            </p>
            <UserAddressModal
              triggerElement={<AddAddressButton />}
              isOpen={isAddModalOpen}
              setIsOpen={setIsAddModalOpen}
              onSuccess={() => {
                // Refresh will happen automatically due to React Query
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman ({addresses.length})
          </div>
          <UserAddressModal
            triggerElement={
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            }
            isOpen={isAddModalOpen}
            setIsOpen={setIsAddModalOpen}
            onSuccess={() => {
              // Refresh will happen automatically due to React Query
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 relative ${
                selectedAddressId === address.id
                  ? "bg-primary/5 border-primary"
                  : "border-border"
              }`}
              onClick={() => onAddressSelect(address)}
            >
              {selectedAddressId === address.id && (
                <div className="absolute top-3 right-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={address.is_default ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {address.label}
                  </Badge>
                  {address.is_default && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Utama
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-foreground">
                  {address.recipient_name}
                </p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="text-muted-foreground">
                  {address.address_line_1}
                  {address.address_line_2 && (
                    <>
                      <br />
                      {address.address_line_2}
                    </>
                  )}
                </p>
                <p className="text-muted-foreground">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                {address.country && (
                  <p className="text-muted-foreground text-xs">
                    {address.country}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedAddressId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Alamat pengiriman dipilih</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
