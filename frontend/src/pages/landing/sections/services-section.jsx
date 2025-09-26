import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const navigate = useNavigate();

  const servicesList = [
    {
      number: 1,
      title: "Produk Lengkap",
      description:
        "Kami menyediakan ribuan jenis komponen elektronik dari berbagaimerek terpercaya dengan kualitas terjamin",
      class: "from-sky-400 to-sky-500",
    },
    {
      number: 2,
      title: "Pengiriman Cepat",
      description:
        "Dapatkan pengiriman gratis untuk pembelian minimal dan pengiriman ekspres ke seluruh Indonesia.",
      class: "from-emerald-400 to-emerald-500",
    },
    {
      number: 3,
      title: "Dukungan Teknis 24/7",
      description:
        "Tim ahli kami siap membantu Anda memilih komponen yang tepat dan memberikan konsultasi teknis.",
      class: "from-indigo-400 to-indigo-500",
    },
  ];

  return (
    <section id="layanan" className="px-8 mb-24">
      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium mb-5 leading-tight text-center">
        Layanan
      </h2>
      <p className="text-center max-w-2xl mx-auto text-base">
        Berbagai layanan terbaik untuk mendukung setiap kebutuhan proyek
        elektronik Anda.
      </p>
      <div className="mt-10">
        <ul className="grid md:grid-cols-3 grid-cols-1 gap-8">
          {servicesList.map((item, index) => {
            return (
              <li key={index} className="group h-full">
                <div
                  className={`relative overflow-hidden bg-gradient-to-br rounded-xl shadow-lg hover:shadow-2xl p-8 flex flex-col items-start text-white transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[280px] ${item.class}`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700"></div>

                  {/* Number badge */}
                  <div className="relative z-10 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                    <span className="text-2xl font-bold">{item.number}</span>
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
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-1 justify-center mt-12">
        <Button
          onClick={() => navigate("/services")}
          className="px-8 py-6 flex items-center gap-2"
        >
          Lihat Selengkapnya
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
