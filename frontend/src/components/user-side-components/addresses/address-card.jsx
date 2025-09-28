import { Star, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAddressModal } from "./data-address-modal";
import { UserAddressAlert } from "./data-address-alert";

export function AddressCard({
  address,
  onSetDefault,
  isDeleteLoading,
  isSetDefaultLoading,
}) {
  const EditAddressDialogTrigger = () => (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  );

  const DeleteAddressAlertTrigger = () => (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="border rounded-lg p-4 relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
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
              <p className="text-muted-foreground text-xs">{address.country}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              disabled={isSetDefaultLoading}
            >
              <Star className="h-3 w-3 mr-1" />
              {isSetDefaultLoading ? "Setting..." : "Set Utama"}
            </Button>
          )}
          <UserAddressModal
            triggerElement={EditAddressDialogTrigger()}
            initialAddress={address}
          />
          {/* Delete Button with Confirmation */}
          <UserAddressAlert
            trigger={DeleteAddressAlertTrigger()}
            address={address}
          />
        </div>
      </div>
    </div>
  );
}
