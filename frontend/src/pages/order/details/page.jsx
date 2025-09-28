import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/queries/orders.query";
import { formatDate, formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  X,
  ArrowLeft,
  MapPin,
  CreditCard,
  Download,
  MessageCircle,
  RefreshCw,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Star,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { PaymentModal } from "@/components/order/payment-modal";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useOrder(orderId);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Menunggu",
        variant: "secondary",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      processing: {
        label: "Diproses",
        variant: "secondary",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      shipped: {
        label: "Dikirim",
        variant: "default",
        icon: Truck,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      delivered: {
        label: "Diterima",
        variant: "secondary",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      cancelled: {
        label: "Dibatalkan",
        variant: "destructive",
        icon: X,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTrackPackage = () => {
    // In a real app, this would redirect to the courier's tracking page
    const trackingNumber = order?.shipping?.trackingNumber;
    if (trackingNumber) {
      window.open(
        `https://www.jne.co.id/id/tracking/trace/${trackingNumber}`,
        "_blank"
      );
    }
  };

  const paymentModalTrigger = () => (
    <Button variant="outline" className="w-full justify-start">
      <CreditCard className="h-4 w-4 mr-2" />
      Bayar Sekarang
    </Button>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <AlertCircle className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Gagal Memuat Pesanan
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error.message ||
              "Terjadi kesalahan saat memuat detail pesanan. Silakan coba lagi."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Pesanan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <AlertCircle className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Pesanan Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Pesanan dengan ID {orderId} tidak ditemukan. Mungkin ID pesanan
            salah atau pesanan sudah dihapus.
          </p>
          <Button onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Pesanan
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order?.status);
  const StatusIcon = statusInfo.icon;
  const subtotal = (order?.order_details || []).reduce(
    (sum, detail) => sum + detail.price * detail.quantity,
    0
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/orders")}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Order #{order?.id}
            </h1>
            <Badge
              variant={statusInfo.variant}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Dipesan pada {formatDate(order?.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Timeline */}
          {order?.timeline && order.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((step, index) => (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-2 ${
                              step.completed ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium ${
                              step.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {step.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Produk yang Dipesan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order?.order_details || []).map((detail) => (
                  <div
                    key={detail.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          detail.product?.image_url ||
                          "/src/assets/placeholder.svg"
                        }
                        alt={detail.product?.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/src/assets/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-2">
                        {detail.product?.name || "Unknown Product"}
                      </h4>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="secondary">
                          {detail.product?.category?.name || "Kategori"}
                        </Badge>
                        {detail.product?.sku && (
                          <span className="text-sm text-muted-foreground">
                            SKU: {detail.product.sku}
                          </span>
                        )}
                      </div>
                      {detail.product?.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {detail.product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Qty: {detail.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(detail.price)} / pcs
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {formatCurrency(detail.price * detail.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order?.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{order.notes}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order?.id &&
                !order?.payment_proof &&
                order.status !== "cancelled" && (
                  <PaymentModal
                    triggerElement={paymentModalTrigger()}
                    initial={{ id: order.id }}
                    onSuccess={() => window.location.reload()}
                  />
                )}
              {/* <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button> */}
              {order?.shipping?.trackingNumber && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleTrackPackage}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Lacak Paket
                </Button>
              )}
              {/* <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi Penjual
              </Button> */}
              {order?.status === "delivered" && (
                <>
                  <Button className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Beli Lagi
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Beri Rating
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Informasi Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  ALAMAT PENGIRIMAN
                </h4>
                <div className="space-y-1">
                  {order?.shipping_address ? (
                    <>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">
                          {order.shipping_address.recipient_name ||
                            "Nama Penerima"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {order.shipping_address.phone ||
                            "Nomor telepon tidak tersedia"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">
                          {[
                            order.shipping_address.address,
                            order.shipping_address.city,
                            order.shipping_address.province,
                            order.shipping_address.postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Alamat pengiriman tidak tersedia
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  METODE PENGIRIMAN
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Kurir</span>
                    <span className="text-sm font-medium">
                      {order?.shipping?.method || "Belum ditentukan"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ongkos Kirim</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(order?.shipping?.cost || 0)}
                    </span>
                  </div>
                  {order?.shipping?.trackingNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">No. Resi</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {order.shipping.trackingNumber}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(order.shipping.trackingNumber)
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {order?.shipping?.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-sm">Est. Tiba</span>
                      <span className="text-sm">
                        {formatDate(order.shipping.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                  {order?.shipping?.actualDelivery && (
                    <div className="flex justify-between">
                      <span className="text-sm">Diterima</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatDate(order.shipping.actualDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  METODE PEMBAYARAN
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Metode</span>
                    <span className="text-sm font-medium">
                      {order?.payment?.method || "Transfer Bank"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status</span>
                    <Badge
                      variant={
                        order?.payment_proof ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {order?.payment_proof ? "Bukti Upload" : "Belum Bayar"}
                    </Badge>
                  </div>
                  {order?.updated_at && order?.payment_proof && (
                    <div className="flex justify-between">
                      <span className="text-sm">Upload Bukti</span>
                      <span className="text-sm">
                        {formatDate(order.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  RINGKASAN PEMBAYARAN
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ongkos Kirim</span>
                    <span className="text-sm">
                      {formatCurrency(order?.shipping?.cost || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(
                        parseFloat(order?.total_price || 0) +
                          (order?.shipping?.cost || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
