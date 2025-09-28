import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, ArrowRight, Package } from "lucide-react";
import ProductCard from "@/components/user-side-components/product-card";
import { useProducts } from "@/hooks/queries/products.query";
import { formatPrice } from "@/lib/utils";

export default function ProductSection() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useProducts(0, 3);

  const [hoveredProduct, setHoveredProduct] = useState(null);

  const renderLoading = () => {
    return [...Array(3)].map((_, index) => (
      <Card key={index} className="overflow-hidden animate-pulse">
        <CardContent className="p-0">
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>

          <div className="p-6">
            {/* Category badge skeleton */}
            <div className="h-5 bg-gray-200 rounded-full w-20 mb-3"></div>

            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Price skeleton */}
            <div className="h-7 bg-gray-200 rounded w-1/2 mb-4"></div>

            {/* Button skeleton */}
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderData = (products) => {
    return products.map((item) => (
      <ProductCard
        key={item.id}
        product={item}
        formatPrice={formatPrice}
        isHovered={hoveredProduct === item.id}
        onHover={(hovered) => setHoveredProduct(hovered ? item.id : null)}
      />
    ));
  };

  return (
    <section id="produk" className="px-8 mb-24">
      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium mb-5 leading-tight text-center">
        Produk
      </h2>
      <p className="text-center">Berbagai produk unggulan kami.</p>

      <div className="produk-box mt-10 grid md:grid-cols-3 grid-cols-1 gap-8">
        {isLoading ? (
          renderLoading()
        ) : data?.length ? (
          renderData(data)
        ) : (
          <div className="col-span-3 text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-muted-foreground">
              Produk sedang dalam proses penambahan. Silakan kembali lagi nanti.
            </p>
          </div>
        )}
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
