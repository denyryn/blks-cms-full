import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileDropzone from "@/components/file-dropzone";

import { useUpdateOrder } from "@/hooks/queries/orders.query";
import { toast } from "sonner";

export function PaymentModal({ initial, triggerElement, onSuccess }) {
  // Don't render if no initial data or id
  if (!initial?.id) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    data: { id: initial.id, payment_proof: null },
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const mode = "add"; // Always in add mode for payment proof upload
  const updateOrder = useUpdateOrder();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.data.payment_proof) {
      toast.error("Please upload a payment proof image.");
      return;
    }

    let response, data;

    switch (mode) {
      case "add":
        ({ response, data } = await updateOrder.mutateAsync({
          id: initial.id,
          payment_proof: form.data.payment_proof,
        }));
        break;
      default:
        return;
    }

    if (!response.ok) {
      toast.error(data?.message || "Operation failed. Please try again.");
      return;
    }

    // onSuccess?.();
    setOpen(false);
    setForm({ data: { payment_proof: null } });
    setUploadedFiles([]);
    toast.success(data?.message || "Payment proof uploaded successfully!");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  }

  function handleFilesChange(file) {
    if (file) {
      setUploadedFiles([file]);
      setForm((prev) => ({
        ...prev,
        data: { ...prev.data, payment_proof: file },
      }));
    } else {
      setUploadedFiles([]);
      setForm((prev) => ({
        ...prev,
        data: { ...prev.data, payment_proof: null },
      }));
    }
  }

  const title = "Upload Payment Proof";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>{triggerElement}</DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Upload an image of your payment proof (receipt, transfer
                confirmation, etc.). Supported formats: JPG, PNG, GIF. Max size:
                10MB.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="payment_proof">Payment Proof</Label>
                <div className="min-h-[120px]">
                  <FileDropzone onFileSelect={handleFilesChange} />
                </div>
                {uploadedFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    File selected: {uploadedFiles[0].name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!form.data.payment_proof}>
                Upload Payment Proof
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
