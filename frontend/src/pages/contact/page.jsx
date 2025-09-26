import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      title: "Nomor Telepon",
      value: "+62 812-3456-7890",
      description: "Hubungi kami untuk konsultasi langsung",
      icon: Phone,
      color: "from-blue-400 to-blue-600",
      action: "tel:+6281234567890",
    },
    {
      title: "Email",
      value: "info@protech.id",
      description: "Kirim email untuk pertanyaan detail",
      icon: Mail,
      color: "from-emerald-400 to-emerald-600",
      action: "mailto:info@protech.id",
    },
    {
      title: "Alamat Kantor",
      value: "Jl. Teknologi No. 123, Jakarta Selatan 12560",
      description: "Kunjungi showroom kami untuk melihat produk",
      icon: MapPin,
      color: "from-purple-400 to-purple-600",
      action: "https://maps.google.com",
    },
    {
      title: "Jam Operasional",
      value: "Senin - Jumat: 09:00 - 17:00 WIB",
      description: "Sabtu: 09:00 - 15:00 WIB",
      icon: Clock,
      color: "from-orange-400 to-orange-600",
      action: null,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Hubungi ProTech.id
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
          Kami Siap Membantu
          <span className="text-primary block lg:inline lg:ml-2">
            Proyek Anda
          </span>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          Kami senang mendengar dari Anda! Apakah Anda memiliki pertanyaan
          tentang produk, butuh konsultasi teknis, atau ingin berkonsultasi
          tentang proyek elektronik Anda, tim ahli kami siap membantu.
        </p>
      </div>

      {/* Contact Form */}
      <div className="mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Kirim Pesan</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Isi formulir di bawah dan kami akan merespons dalam 24 jam.
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Pesan Berhasil Dikirim!
                </h3>
                <p className="text-muted-foreground">
                  Terima kasih atas pesan Anda. Tim kami akan segera menghubungi
                  Anda.
                </p>
              </div>
            ) : (
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
                        className="pl-10"
                        required
                      />
                    </div>
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
                        className="pl-10"
                        required
                      />
                    </div>
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
                    className="min-h-[120px] resize-y"
                    required
                  />
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
                    onClick={() =>
                      setFormData({ name: "", email: "", message: "" })
                    }
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                </div>

                {/* Form Footer */}
                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>
                    * Field wajib diisi. Data Anda aman dan tidak akan dibagikan
                    kepada pihak ketiga. Dengan mengirim form ini, Anda
                    menyetujui untuk dihubungi oleh tim ProTech.id.
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Informasi Kontak
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hubungi kami melalui channel yang paling nyaman untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() =>
                  info.action &&
                  window.open(
                    info.action,
                    info.action.startsWith("http") ? "_blank" : "_self"
                  )
                }
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground mb-2 break-words">
                    {info.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-muted/30">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Butuh Bantuan Segera?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Untuk pertanyaan urgent atau konsultasi teknis mendalam, hubungi
            hotline kami atau kunjungi live chat di website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Hotline: 0812-3456-7890
            </Button>
            <Button variant="outline" size="lg">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
