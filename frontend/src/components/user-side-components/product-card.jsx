import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Eye, ShoppingCart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useCartActions } from "@/contexts/cart.context";

export default function ProductCard({
  product,
  viewMode,
  formatPrice,
  isHovered,
  onHover,
}) {
  const navigate = useNavigate();
  const { isInCart, quantity, isLoading, add, increment, decrement } =
    useCartActions(product.id);

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    if (isInCart) {
      increment();
    } else {
      add(1);
    }
  };

  if (viewMode === "list") {
    return (
      <Card
        className="group overflow-hidden hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-48 h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
              <img
                src={
                  product?.image_url || product?.image || config.imageFallback
                }
                alt={product.name}
                onError={(e) => {
                  e.target.src = config.imageFallback;
                }}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              <Badge
                variant="secondary"
                className={`absolute top-3 left-3 border-0 ${
                  isInCart
                    ? "bg-primary/90 text-white"
                    : "bg-emerald-500/90 text-white"
                }`}
              >
                {isInCart ? `Dalam Keranjang (${quantity})` : "Tersedia"}
              </Badge>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ⭐ {product.rating}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="sm" variant="outline" onClick={handleViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  Detail
                </Button>
                {isInCart ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={decrement}
                      disabled={isLoading}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium px-3 py-2 bg-muted rounded">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={increment}
                      disabled={isLoading}
                    >
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    Tambah ke Keranjang
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={product?.image_url || product?.image || config.imageFallback}
            alt={product.name}
            className="w-full h-48 object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = config.imageFallback;
            }}
          />

          {/* Stock Badge */}
          <Badge
            variant="secondary"
            className={`absolute top-3 left-3 border-0 backdrop-blur-sm ${
              isInCart
                ? "bg-primary/90 text-white"
                : "bg-emerald-500/90 text-white"
            }`}
          >
            {isInCart ? `Keranjang (${quantity})` : "Tersedia"}
          </Badge>

          {/* Hover Action Buttons */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-slate-900 shadow-lg backdrop-blur-sm"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat
            </Button>
            <Button
              size="sm"
              className="bg-primary/90 hover:bg-primary text-white shadow-lg"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-1" />
              )}
              {isInCart ? `+1 (${quantity})` : "Beli"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>

            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center text-xs text-slate-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              {isInCart ? `Dalam keranjang: ${quantity}` : "Tersedia"}
            </div>
            {isInCart ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrement}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increment}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                className="text-primary hover:text-primary hover:bg-primary/10 p-2"
              >
                Detail <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
