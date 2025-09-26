import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, ArrowRight } from "lucide-react";
import ProductCard from "@/components/user-side-components/product-card";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";

export default function ProductSection() {
  const navigate = useNavigate();
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(0, 3);

  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <section id="produk" className="px-8 mb-24">
      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium mb-5 leading-tight text-center">
        Produk
      </h2>
      <p className="text-center">Berbagai produk unggulan kami.</p>

      <div className="produk-box mt-10 grid md:grid-cols-3 grid-cols-1 gap-8">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            formatPrice={formatPrice}
            isHovered={hoveredProduct === item.id}
            onHover={(hovered) => setHoveredProduct(hovered ? item.id : null)}
          />
        ))}
      </div>

      {/* Lihat Semua Produk */}
      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          onClick={() => navigate("/products")}
          className="text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          Lihat Semua Produk
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
