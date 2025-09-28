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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useDeleteUserAddress } from "@/hooks/queries/user-addresses.query";

export function UserAddressAlert({ trigger, address, onSuccess }) {
  const [open, setOpen] = useState(false);
  const deleteUserAddress = useDeleteUserAddress();

  async function handleConfirm() {
    const { response, data } = await deleteUserAddress(address.id);

    if (!response.ok) {
      toast.error(data?.message || "Deletion failed. Please try again.");
      return;
    }

    onSuccess?.();
    setOpen(false);
    toast.success(data?.message || "Address deleted successfully!");
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} asChild>
            <Button variant="destructive">Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
