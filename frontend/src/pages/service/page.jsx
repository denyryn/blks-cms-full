import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  DollarSign,
  HeadphonesIcon,
  Users,
  CheckCircle,
  Star,
  Truck,
  Wrench,
  ArrowRight,
  Package,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router";

export default function ServicePage() {
  const servicesList = [
    {
      number: 1,
      title: "Produk Lengkap",
      description:
        "Kami menyediakan ribuan jenis komponen elektronik dari berbagai merek terpercaya dengan kualitas terjamin",
      class: "from-sky-400 to-sky-500",
      icon: Package,
    },
    {
      number: 2,
      title: "Pengiriman Cepat",
      description:
        "Dapatkan pengiriman gratis untuk pembelian minimal dan pengiriman ekspres ke seluruh Indonesia.",
      class: "from-emerald-400 to-emerald-500",
      icon: Truck,
    },
    {
      number: 3,
      title: "Dukungan Teknis 24/7",
      description:
        "Tim ahli kami siap membantu Anda memilih komponen yang tepat dan memberikan konsultasi teknis.",
      class: "from-indigo-400 to-indigo-500",
      icon: Wrench,
    },
  ];

  const whyChooseUs = [
    {
      title: "Kualitas Terjamin",
      description:
        "Semua produk kami telah melewati quality control ketat dan bergaransi resmi dari distributor. Kami hanya menjual produk original dengan sertifikasi internasional.",
      icon: Shield,
      color: "from-green-400 to-emerald-600",
      features: [
        "Produk Original 100%",
        "Garansi Resmi",
        "Quality Control Ketat",
        "Sertifikasi Internasional",
      ],
    },
    {
      title: "Harga Kompetitif",
      description:
        "Dapatkan harga terbaik untuk semua komponen elektronik. Kami memberikan penawaran khusus untuk pembelian dalam jumlah besar dan member setia.",
      icon: DollarSign,
      color: "from-blue-400 to-blue-600",
      features: [
        "Harga Wholesale",
        "Diskon Member",
        "Promo Bulanan",
        "Cashback Program",
      ],
    },
    {
      title: "Customer Support",
      description:
        "Tim customer service profesional siap membantu 24/7 melalui berbagai channel. Konsultasi teknis gratis untuk membantu project Anda.",
      icon: HeadphonesIcon,
      color: "from-purple-400 to-purple-600",
      features: [
        "Support 24/7",
        "Konsultasi Gratis",
        "Live Chat",
        "Remote Assistance",
      ],
    },
    {
      title: "Komunitas Maker",
      description:
        "Bergabung dengan ribuan maker, engineer, dan hobbyist. Sharing project, tutorial, dan dapatkan inspirasi untuk inovasi berikutnya.",
      icon: Users,
      color: "from-orange-400 to-orange-600",
      features: [
        "Forum Komunitas",
        "Workshop Gratis",
        "Project Showcase",
        "Networking Events",
      ],
    },
  ];

  const orderingSteps = [
    {
      step: 1,
      title: "Pilih Produk",
      description:
        "Jelajahi katalog lengkap kami dan pilih komponen yang Anda butuhkan untuk proyek elektronik Anda",
      icon: Package,
      color: "from-blue-400 to-blue-600",
    },
    {
      step: 2,
      title: "Checkout dan Pilih Metode",
      description:
        "Pilih metode pengiriman yang sesuai dan metode pembayaran yang Anda inginkan dengan mudah",
      icon: Truck,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      step: 3,
      title: "Lakukan Pembayaran dengan Aman",
      description:
        "Proses pembayaran yang aman dan terpercaya dengan berbagai pilihan metode pembayaran digital",
      icon: Shield,
      color: "from-purple-400 to-purple-600",
    },
    {
      step: 4,
      title: "Produk Dikirim dan Nikmati",
      description:
        "Produk akan dikirim dengan packaging aman dan nikmati layanan after-sales terbaik dari kami",
      icon: Award,
      color: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Layanan ProTech.id
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
          Layanan Terbaik untuk
          <span className="text-primary block lg:inline lg:ml-2">
            Proyek Elektronik Anda
          </span>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          Berbagai layanan komprehensif untuk mendukung setiap kebutuhan proyek
          elektronik Anda, dari konsultasi hingga implementasi dengan standar
          kualitas terbaik.
        </p>
      </div>

      {/* Main Services */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Layanan Utama Kami
        </h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
          {servicesList.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="group h-full">
                <div
                  className={`relative overflow-hidden bg-gradient-to-br rounded-xl shadow-lg hover:shadow-2xl p-8 flex flex-col items-start text-white transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[320px] ${item.class}`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700"></div>

                  {/* Icon & Number */}
                  <div className="relative z-10 flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white border-white/30"
                    >
                      0{item.number}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-white/90 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                    >
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Kenapa Memilih Kami?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lebih dari sekedar distributor komponen, kami adalah partner
            terpercaya untuk kesuksesan proyek elektronik Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {whyChooseUs.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How to Order Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Bagaimana Cara Memesan?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proses pemesanan yang mudah dan aman hanya dalam 4 langkah
            sederhana. Mulai belanja sekarang dan rasakan pengalaman berbelanja
            yang menyenangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderingSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={index}
                className="relative text-center hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {/* Step indicator line */}
                {index < orderingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-muted-foreground/30 to-transparent transform -translate-y-1/2 z-10"></div>
                )}

                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${step.color}`}></div>

                <CardContent className="pt-6 pb-8">
                  {/* Step number */}
                  <div className="relative mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className="absolute -top-2 -right-2 bg-background border-2 font-bold text-primary"
                    >
                      {step.step}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pembayaran 100% Aman</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Garansi Resmi Semua Produk</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Siap Memulai Proyek Anda?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Hubungi tim kami sekarang untuk konsultasi gratis dan dapatkan
            penawaran terbaik untuk kebutuhan komponen elektronik proyek Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/kontak">
                Hubungi Kami Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/produk">Lihat Katalog Produk</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
