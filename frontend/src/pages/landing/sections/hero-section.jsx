import { Button } from "@/components/ui/button";
import { CircleCheck, Truck, Wrench } from "lucide-react";
import { useNavigate } from "react-router";

import Hero from "@/assets/arduino-parts.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const servicesList = [
    {
      text: "Produk Lengkap",
      icon: CircleCheck,
    },
    {
      text: "Pengiriman Cepat",
      icon: Truck,
    },
    {
      text: "Dukungan Teknis",
      icon: Wrench,
    },
  ];
  return (
    <section className="relative flex flex-row-reverse items-center gap-10 min-h-[90vh] w-full px-8 mb-24 justify-center">
      {/* Mobile hero image */}
      <div className="absolute inset-0 lg:hidden">
        <img src={Hero} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Desktop hero image */}
      <img
        src={Hero}
        alt="Hero"
        className="w-full h-full max-w-xl object-contain hidden lg:block"
      />

      {/* Hero Text */}
      <div className="relative z-20 text-white lg:text-foreground px-4">
        {/* Hero Title */}
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold mb-5 leading-tight">
          Penjualan Komponen Elektronika dan Robotika
        </h1>

        {/* Hero Description */}
        <p className="text-lg mb-3 leading-relaxed opacity-90 lg:opacity-100">
          Selamat datang di <span className="font-semibold">ProTech.id</span>,
          rumahnya komponen elektronik & sensor robotika. Temukan solusi terbaik
          untuk proyek dan eksperimenmu di sini!
        </p>

        <p className="text-lg mb-6 leading-relaxed opacity-90 lg:opacity-100">
          Mulai dari sensor, modul, hingga kit robot lengkap semuanya tersedia
          di satu tempat!
        </p>

        {/* Hero Features */}
        <ul className="mb-8 space-y-3">
          {servicesList.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <item.icon className="text-white lg:text-primary w-4 h-4" />
              </div>
              <span className="text-base text-white lg:text-foreground">
                {item.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex gap-4">
          <Button onClick={() => navigate("/products")} className="px-8 py-6">
            Belanja Sekarang
          </Button>

          <Button
            onClick={() => navigate("/about")}
            variant="outline"
            className="px-8 py-6"
          >
            Tentang Kami
          </Button>
        </div>
      </div>
    </section>
  );
}
