import { useState } from "react";
import { Mail, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { storeGuestMessage } from "@/api-services/guest-message.service";
import { set } from "zod";
import { toast } from "sonner";

export function Form({ setIsSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Pesan wajib diisi";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Pesan minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send form data to backend
      const response = await storeGuestMessage(formData);

      // Check if the response indicates success
      if (response?.success || response?.data) {
        // Clear form on success
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        setIsSubmitted(true);
        toast.success(
          "Pesan berhasil dikirim! Kami akan segera menghubungi Anda."
        );

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(response?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nama Lengkap *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={formData.name}
              onChange={handleInputChange}
              className={`pl-10 ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
              required
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`pl-10 ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
              required
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Pesan *
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tuliskan pertanyaan atau pesan Anda di sini. Jelaskan detail proyek atau komponen yang Anda butuhkan..."
          value={formData.message}
          onChange={handleInputChange}
          className={`min-h-[120px] resize-y ${
            errors.message ? "border-red-500 focus:border-red-500" : ""
          }`}
          required
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Mengirim...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Kirim Pesan
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            setFormData({ name: "", email: "", message: "" });
            setErrors({});
          }}
          disabled={isSubmitting}
        >
          Reset Form
        </Button>
      </div>

      {/* Form Footer */}
      <div className="text-xs text-muted-foreground pt-4 border-t">
        <p>
          * Field wajib diisi. Data Anda aman dan tidak akan dibagikan kepada
          pihak ketiga. Dengan mengirim form ini, Anda menyetujui untuk
          dihubungi oleh tim ProTech.id.
        </p>
      </div>
    </form>
  );
}
