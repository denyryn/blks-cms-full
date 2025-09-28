import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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

import { updateProfile } from "@/api-services/profile.service";
import { useAuth } from "@/hooks/queries/auths.query";

// Zod validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(2, "Email minimal 2 karakter")
    .max(255, "Email maksimal 255 karakter")
    .email("Format email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[+]?[\d\s-()]+$/, "Format nomor telepon tidak valid"),
});

export function UserProfileModal({
  triggerElement,
  initialProfile,
  onSuccess,
}) {
  const { data: user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and Zod
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialProfile?.name || "",
      email: initialProfile?.email || "",
      phone: initialProfile?.phone || "",
    },
  });

  // Reusable form field component
  const FormFieldComponent = ({
    name,
    label,
    placeholder,
    type = "text",
    required = true,
    as: Component = Input,
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
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Update user profile
      const result = await updateProfile({ ...data, id: user.id });

      if (result?.success || result?.data) {
        toast.success("Profil berhasil diperbarui!");

        form.reset();
        setIsOpen(false);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        toast.error(result?.message || "Gagal menyimpan profil");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Terjadi kesalahan saat menyimpan profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog opens/closes
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui informasi profil Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Fullname */}
              <FormFieldComponent
                name="name"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap Anda"
              />
              {/* Email */}
              <FormFieldComponent
                name="email"
                label="Email"
                placeholder="nama@email.com"
                type="email"
              />
              {/* Phone */}
              <FormFieldComponent
                name="phone"
                label="Nomor Telepon"
                placeholder="+62 812-3456-7890"
                type="tel"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
