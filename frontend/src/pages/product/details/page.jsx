import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  Package,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProduct } from "@/hooks/use-products";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, loading, error } = useProduct(id);

  // Mock additional images for demo (in real app, this would come from API)
  console.log(product);
  const productImages = [product?.image_url] || [
    "/src/assets/arduino-parts.jpg",
    "/src/assets/techy-graphic.png",
    "/src/assets/service-illustration.jpg",
    "/src/assets/arduino-parts.jpg",
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} of product ${product.id} to cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Produk yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <Button onClick={() => navigate("/products")}>
              Kembali ke Produk
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Produk
        </button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    e.target.src = "/src/assets/arduino-parts.jpg";
                  }}
                />

                {/* Navigation Arrows */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? productImages.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === productImages.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Stock Badge */}
                <Badge
                  variant="secondary"
                  className="absolute top-4 left-4 bg-emerald-500/90 text-white border-0"
                >
                  Stok Tersedia
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImage === index
                    ? "border-primary shadow-lg"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain p-2 bg-slate-50"
                  onError={(e) => {
                    e.target.src = "/src/assets/arduino-parts.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 4)
                        ? "text-yellow-400 fill-current"
                        : "text-slate-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  ({product.rating || "4.5"}) • 25+ ulasan
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold text-primary mb-2">
              {formatPrice(product.price)}
            </div>

            <div
              className="text-muted-foreground leading-relaxed prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <Separator />

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Jumlah
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Stok: 50+ tersedia
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tambah ke Keranjang
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-red-500 border-red-200" : ""}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Garansi Resmi</div>
                <div className="text-xs text-muted-foreground">1 tahun</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Pengiriman</div>
                <div className="text-xs text-muted-foreground">2-3 hari</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Retur</div>
                <div className="text-xs text-muted-foreground">7 hari</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Kemasan</div>
                <div className="text-xs text-muted-foreground">Aman</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Deskripsi Produk
          </h2>

          <div
            className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </CardContent>
      </Card>

      {/* Product Specifications */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Spesifikasi Produk
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-muted-foreground font-medium">
                  Kategori
                </span>
                <span className="font-semibold text-foreground">
                  {product.category_name || "Elektronik"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-muted-foreground font-medium">SKU</span>
                <span className="font-semibold text-foreground">
                  PRD-{product.id}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-muted-foreground font-medium">Berat</span>
                <span className="font-semibold text-foreground">500g</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-muted-foreground font-medium">
                  Dimensi
                </span>
                <span className="font-semibold text-foreground">
                  15 x 10 x 5 cm
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Catatan:</strong> Produk ini
              dirancang dengan teknologi terbaru untuk memenuhi kebutuhan proyek
              elektronik dan robotika Anda. Dengan kualitas terjamin dan
              performa yang handal, produk ini cocok untuk berbagai aplikasi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
