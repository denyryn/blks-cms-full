import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  createUserAddress,
  updateUserAddress,
} from "@/api-services/user-addresses.service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth.context";

// Zod validation schema
const addressSchema = z.object({
  label: z
    .string()
    .min(1, "Label alamat wajib diisi")
    .max(100, "Label alamat maksimal 100 karakter"),
  recipient_name: z
    .string()
    .min(2, "Nama penerima minimal 2 karakter")
    .max(255, "Nama penerima maksimal 255 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[+]?[\d\s-()]+$/, "Format nomor telepon tidak valid"),
  address_line_1: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(255, "Alamat maksimal 255 karakter"),
  address_line_2: z
    .string()
    .max(255, "Alamat baris 2 maksimal 255 karakter")
    .optional(),
  city: z
    .string()
    .min(2, "Kota minimal 2 karakter")
    .max(100, "Kota maksimal 100 karakter"),
  state: z
    .string()
    .min(2, "Provinsi minimal 2 karakter")
    .max(100, "Provinsi maksimal 100 karakter"),
  postal_code: z
    .string()
    .min(5, "Kode pos minimal 5 karakter")
    .max(10, "Kode pos maksimal 10 karakter")
    .regex(/^\d+$/, "Kode pos hanya boleh berisi angka"),
  country: z
    .string()
    .min(2, "Negara minimal 2 karakter")
    .max(100, "Negara maksimal 100 karakter"),
  is_default: z.boolean().default(false),
});

export function UserAddressModal({
  triggerElement,
  initialAddress,
  onSuccess,
}) {
  const mode = initialAddress ? "edit" : "add";
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Initialize form with react-hook-form and Zod
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: initialAddress?.label || "",
      recipient_name: initialAddress?.recipient_name || "",
      phone: initialAddress?.phone || "",
      address_line_1: initialAddress?.address_line_1 || "",
      address_line_2: initialAddress?.address_line_2 || "",
      city: initialAddress?.city || "",
      state: initialAddress?.state || "",
      postal_code: initialAddress?.postal_code || "",
      country: initialAddress?.country || "Indonesia",
      is_default: initialAddress?.is_default || false,
    },
  });

  // Reusable form field component
  const FormFieldComponent = ({
    name,
    label,
    placeholder,
    type = "text",
    required = true,
    Component = Input,
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Component
              placeholder={placeholder}
              type={type}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Handle form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      let response, resultData;

      if (mode === "edit") {
        ({ response, data: resultData } = await updateUserAddress(
          initialAddress.id,
          formData
        ));
      } else {
        ({ response, data: resultData } = await createUserAddress({
          ...formData,
          user_id: user.id,
        }));
      }

      if (response.ok) {
        toast.success(
          mode === "edit"
            ? "Alamat berhasil diperbarui!"
            : "Alamat berhasil ditambahkan!"
        );

        form.reset();
        setOpen(false);

        if (onSuccess) {
          onSuccess(resultData);
        }
      } else {
        toast.error(resultData?.message || "Gagal menyimpan alamat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan alamat");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog opens/closes
  const handleOpenChange = (open) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Alamat" : "Tambah Alamat Baru"}
          </DialogTitle>
          <DialogDescription>
            Lengkapi informasi alamat pengiriman Anda
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Label and Recipient Name */}
              <FormFieldComponent
                name="label"
                label="Label Alamat"
                placeholder="Contoh: Rumah, Kantor"
              />
              <FormFieldComponent
                name="recipient_name"
                label="Nama Penerima"
                placeholder="Nama lengkap penerima"
              />

              {/* Phone */}
              <div className="md:col-span-2">
                <FormFieldComponent
                  name="phone"
                  label="Nomor Telepon"
                  placeholder="+62 812-3456-7890"
                  type="tel"
                />
              </div>

              {/* Address Lines */}
              <div className="md:col-span-2">
                <FormFieldComponent
                  name="address_line_1"
                  label="Alamat Lengkap (Baris 1)"
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                  as={Textarea}
                />
              </div>

              <div className="md:col-span-2">
                <FormFieldComponent
                  name="address_line_2"
                  label="Alamat Lengkap (Baris 2)"
                  placeholder="Detail tambahan alamat (opsional)"
                  required={false}
                />
              </div>

              {/* City, State, Postal Code */}
              <FormFieldComponent
                name="city"
                label="Kota/Kabupaten"
                placeholder="Jakarta"
              />
              <FormFieldComponent
                name="state"
                label="Provinsi"
                placeholder="DKI Jakarta"
              />

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    name="postal_code"
                    label="Kode Pos"
                    placeholder="12345"
                  />
                  <FormFieldComponent
                    name="country"
                    label="Negara"
                    placeholder="Indonesia"
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Jadikan alamat utama
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Menyimpan..."
                  : mode === "edit"
                  ? "Perbarui Alamat"
                  : "Simpan Alamat"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
