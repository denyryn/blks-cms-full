import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag,
  X,
} from "lucide-react";
import { Link } from "react-router";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Arduino Uno R3 Original",
      price: 125000,
      quantity: 2,
      image: "/src/assets/arduino-parts.jpg",
      category: "Microcontroller",
      stock: 15,
      description: "Arduino Uno R3 original dengan USB cable",
    },
    {
      id: 2,
      name: "Sensor Ultrasonik HC-SR04",
      price: 25000,
      quantity: 1,
      image: "/src/assets/arduino-parts.jpg",
      category: "Sensor",
      stock: 50,
      description: "Sensor jarak ultrasonik untuk project robotika",
    },
    {
      id: 3,
      name: "Breadboard 830 Lubang",
      price: 15000,
      quantity: 3,
      image: "/src/assets/arduino-parts.jpg",
      category: "Prototyping",
      stock: 25,
      description: "Breadboard berkualitas tinggi untuk prototyping",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    // Simulate promo code validation
    if (promoCode.toLowerCase() === "protech10") {
      setAppliedPromo({
        code: "PROTECH10",
        discount: 0.1,
        description: "Diskon 10% untuk pelanggan baru",
      });
      setPromoCode("");
    } else {
      // Handle invalid promo code
      alert("Kode promo tidak valid");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shipping = subtotal > 500000 ? 0 : 15000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Keranjang Kosong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Belum ada produk di keranjang Anda. Mulai belanja sekarang dan
            temukan komponen elektronik berkualitas tinggi.
          </p>
          <Link to="/products">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Keranjang Belanja
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} item dalam keranjang Anda
          </p>
        </div>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Lanjut Belanja
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjEyTDE2IDE2IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">
                          {item.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(item.price)}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Subtotal for this item */}
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Stok: {item.stock}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Kode Promo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-800">
                          {appliedPromo.code}
                        </div>
                        <div className="text-sm text-green-600">
                          {appliedPromo.description}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Masukkan kode promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({appliedPromo.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <Badge variant="secondary">GRATIS</Badge>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                {subtotal < 500000 && (
                  <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-800">
                        Gratis Ongkir
                      </span>
                    </div>
                    Belanja {formatCurrency(500000 - subtotal)} lagi untuk
                    mendapatkan gratis ongkir!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button size="lg" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout
            </Button>

            {/* Security Notice */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Pembayaran Aman
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Transaksi Anda dilindungi dengan enkripsi SSL 256-bit
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
