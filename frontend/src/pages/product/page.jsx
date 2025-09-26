import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Grid3X3, List, Package, Star } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import ProductCard from "@/components/user-side-components/product-card";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export default function ProductPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isHoveredCard, setIsHoveredCard] = useState(null);

  // Use real API hooks with dynamic parameters
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(0, 50, sortBy, selectedCategory);
  const { data: categoriesData, loading: categoriesLoading } = useCategories(
    0,
    20
  );

  // Build categories array from API data
  const categories = [
    { value: "all", label: "Semua Kategori" },
    ...(categoriesData || []).map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
  ];

  const sortOptions = [
    { value: "name-asc", label: "Nama A-Z" },
    { value: "name-desc", label: "Nama Z-A" },
    { value: "price-asc", label: "Harga Terendah" },
    { value: "price-desc", label: "Harga Tertinggi" },
  ];

  // Client-side search filtering (since search is handled on frontend)
  const filteredProducts = (products || []).filter((product) => {
    if (!searchQuery) return true;
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderEmpty = () => (
    <div className="col-span-full text-center py-12">
      <div className="text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">Tidak ada produk ditemukan</p>
        <p className="text-sm">
          Coba ubah kata kunci pencarian atau filter yang dipilih.
        </p>
      </div>
    </div>
  );

  const renderList = ({ product }) => (
    <ProductCard
      key={product.id}
      product={product}
      viewMode={viewMode}
      formatPrice={formatPrice}
      isHovered={isHoveredCard === product.id}
      onHover={(hovered) => setIsHoveredCard(hovered ? product.id : null)}
    />
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Semua Produk
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Temukan berbagai produk elektronik dan robotika pilihan terbaik untuk
          proyek Anda.
        </p>
      </div>

      {/* Loading State */}
      {productsLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {productsError && !productsLoading && (
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Gagal Memuat Produk
            </h3>
            <p className="text-muted-foreground mb-4">
              Terjadi kesalahan saat memuat data produk. Silakan coba lagi.
            </p>
            <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
          </CardContent>
        </Card>
      )}

      {/* Show content only when not loading and no error */}
      {!productsLoading && !productsError && (
        <>
          {/* Filters and Controls */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Results Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {`Menampilkan ${filteredProducts.length} dari 
                  ${products?.length || 0} produk`}
                </span>
                {searchQuery && (
                  <span>{`Hasil pencarian untuk "${searchQuery}"`}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products Grid/List */}
          <div
            className={cn({
              "grid gap-6": true,
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
                viewMode === "grid",
              "grid-cols-1": viewMode !== "grid",
            })}
          >
            {filteredProducts.length > 0
              ? filteredProducts.map((product) => renderList({ product }))
              : renderEmpty}
          </div>
        </>
      )}
    </div>
  );
}
