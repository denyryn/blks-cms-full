import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

export default function AboutPage() {
  const stats = [
    {
      number: "500+",
      label: "Proyek Selesai",
      description: "Berhasil menyelesaikan berbagai proyek elektronik",
      icon: CheckCircle,
    },
    {
      number: "1K+",
      label: "Klien Puas",
      description: "Customer yang merasa puas dengan layanan kami",
      icon: Users,
    },
    {
      number: "50+",
      label: "Produk Inovatif",
      description: "Produk teknologi terdepan yang kami tawarkan",
      icon: Star,
    },
    {
      number: "5+",
      label: "Tahun Pengalaman",
      description: "Dedikasi dalam industri teknologi elektronik",
      icon: Clock,
    },
  ];

  const values = [
    {
      title: "Visi Kami",
      description:
        "Menjadi mitra strategis terpercaya dalam menghadirkan solusi teknologi elektronik dan robotika yang berkelanjutan dan inovatif di Indonesia.",
      icon: Eye,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Misi Kami",
      description:
        "Mendorong inovasi teknologi, menciptakan produk elektronik unggul, dan memberikan layanan profesional terbaik untuk kemajuan industri teknologi Indonesia.",
      icon: Target,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Komitmen Kami",
      description:
        "Kami berkomitmen memberikan inovasi terbaik melalui teknologi terbaru, kualitas produk terjamin, dan layanan pelanggan yang responsif.",
      icon: Heart,
      color: "from-purple-400 to-purple-600",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "Pendirian Perusahaan",
      description:
        "ProTech.id didirikan dengan visi menjadi distributor komponen elektronik terdepan",
    },
    {
      year: "2020",
      title: "Ekspansi Produk",
      description:
        "Menambah lini produk robotika dan IoT untuk memenuhi kebutuhan pasar yang berkembang",
    },
    {
      year: "2022",
      title: "Platform Digital",
      description:
        "Meluncurkan platform e-commerce untuk memudahkan akses pelanggan ke produk kami",
    },
    {
      year: "2024",
      title: "Sertifikasi Internasional",
      description:
        "Meraih sertifikasi kualitas internasional dan menjadi partner resmi brand-brand ternama",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Tentang ProTech.id
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
          Mitra Terpercaya Solusi
          <span className="text-primary block lg:inline lg:ml-2">
            Teknologi Elektronik
          </span>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          ProTech.id adalah perusahaan yang bergerak di bidang distribusi
          komponen elektronik dan robotika. Kami berfokus pada penyediaan
          komponen berkualitas tinggi, solusi teknologi inovatif, dan layanan
          konsultasi yang membantu engineer dan hobbyist mewujudkan proyek
          impian mereka.
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vision, Mission, Values */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Nilai & Filosofi Kami
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                ></div>
                <CardHeader className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Company Story */}
      <Card className="mb-16">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Sejarah Perjalanan Kami
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Didirikan pada tahun 2019, ProTech.id lahir dari passion mendalam
              terhadap teknologi elektronik dan keinginan untuk memajukan
              ekosistem teknologi Indonesia. Berawal dari sebuah toko kecil yang
              melayani kebutuhan komponen elektronik lokal, kini kami telah
              berkembang menjadi platform digital terdepan yang melayani ribuan
              pelanggan di seluruh Indonesia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Perjalanan kami dipenuhi dengan dedikasi untuk memberikan produk
              berkualitas tinggi, layanan pelanggan yang responsif, dan solusi
              teknologi yang tepat sasaran. Kami percaya bahwa setiap inovasi
              dimulai dari komponen yang tepat dan dukungan yang solid.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Timeline */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Milestone Penting
            </h3>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="font-semibold">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Bergabunglah dengan Ribuan Pelanggan Puas
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rasakan pengalaman berbelanja komponen elektronik yang berbeda.
            Dapatkan produk berkualitas, konsultasi gratis, dan dukungan teknis
            terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/produk">
                Lihat Produk Kami
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/kontak">Hubungi Kami</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
