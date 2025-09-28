import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/contexts/cart.context";
import { useAuth } from "@/contexts/auth.context";
import { useUserAddresses } from "@/hooks/queries/user-addresses.query";
import { useCreateOrder } from "@/hooks/queries/orders.query";
import { useUserDefaultAddress } from "@/hooks/queries/user-addresses.query";
import { AddressSelector } from "@/components/cart/address-selector";
import config from "@/lib/config";

export default function CartPage() {
  const {
    cartItems,
    loading,
    error,
    isEmpty,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    isUpdatingCart,
    isRemovingFromCart,
    isClearingCart,
    clearError,
  } = useCart();
  const { user } = useAuth();
  const { data: defaultAddress, isLoading: isLoadingDefaultAddress } =
    useUserDefaultAddress();
  const createOrder = useCreateOrder();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Set default address as selected when it loads
  React.useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [defaultAddress, selectedAddress]);

  const handleRemoveItem = (cartId) => {
    removeFromCart(cartId);
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
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shipping = subtotal > 500000 ? 0 : 15000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  function handleCheckout() {
    if (!selectedAddress) {
      alert("Silakan pilih alamat pengiriman terlebih dahulu");
      return;
    }

    createOrder.mutateAsync({
      user_id: user.id,
      user_address_id: selectedAddress.id,
      cart_ids: cartItems.map((item) => item.id),
    });
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
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
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
                        src={item.product?.image_url || config.imageFallback}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = config.imageFallback;
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">
                          {item.product?.name || "Product"}
                        </h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.product?.category?.name || "Category"}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {item.product?.description ||
                            "No description available"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemovingFromCart(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {isRemovingFromCart(item.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(item.product?.price || 0)}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => decrementQuantity(item.id)}
                            disabled={
                              item.quantity <= 1 || isUpdatingCart(item.id)
                            }
                          >
                            {isUpdatingCart(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => incrementQuantity(item.id)}
                            disabled={isUpdatingCart(item.id)}
                          >
                            {isUpdatingCart(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Subtotal for this item */}
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatPrice(
                              (item.product?.price || 0) * item.quantity
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Stok: {item.product?.stock || 0}
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
            {/* Address Selection */}
            <AddressSelector
              selectedAddressId={selectedAddress?.id}
              onAddressSelect={setSelectedAddress}
            />

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
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({appliedPromo.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <Badge variant="secondary">GRATIS</Badge>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                {subtotal < 500000 && (
                  <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-800">
                        Gratis Ongkir
                      </span>
                    </div>
                    Belanja {formatPrice(500000 - subtotal)} lagi untuk
                    mendapatkan gratis ongkir!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              size="lg"
              className="w-full"
              disabled={isEmpty || !selectedAddress || createOrder.isPending}
              onClick={handleCheckout}
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {!selectedAddress ? "Pilih Alamat Dulu" : "Checkout"}
                </>
              )}
            </Button>

            {/* Clear Cart Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={clearCart}
              disabled={isEmpty || isClearingCart}
            >
              {isClearingCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kosongkan Keranjang
                </>
              )}
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
