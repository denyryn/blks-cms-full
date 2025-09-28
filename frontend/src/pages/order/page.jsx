import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  X,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  MessageCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useOrders } from "@/hooks/queries/orders.query";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orders = [], isLoading: isOrderLoading, error } = useOrders();
  const navigate = useNavigate();

  // Show loading state
  if (isOrderLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Pesanan Saya
          </h1>
          <p className="text-muted-foreground">
            Kelola dan lacak semua pesanan Anda di sini
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Gagal Memuat Pesanan
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error.message ||
              "Terjadi kesalahan saat memuat pesanan. Silakan coba lagi."}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

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
      shipping: {
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.order_details || []).some((detail) =>
        detail.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Detail Pesanan</CardTitle>
                <p className="text-muted-foreground">{order.id}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Section */}
              <div className={`${statusInfo.bgColor} p-4 rounded-lg`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                  <div>
                    <div className={`font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pesanan pada {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Produk yang Dipesan
                </h3>
                <div className="space-y-4">
                  {(order.order_details || []).map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                        <h4 className="font-medium">
                          {detail.product?.name || "Unknown Product"}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            Qty: {detail.quantity || 0}
                          </span>
                          <span className="font-medium">
                            {formatPrice(parseFloat(detail.price || 0))}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatPrice(detail.subtotal || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Alamat Pengiriman
                  </h3>
                  <div className="space-y-2">
                    {order.shipping_address ? (
                      <>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">
                            {order.shipping_address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {order.shipping?.method || "Belum ditentukan"}
                          </span>
                        </div>
                        {order.shipping?.trackingNumber && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-mono">
                              {order.shipping.trackingNumber}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Alamat pengiriman belum ditentukan
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Pembayaran</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {order.payment?.method || "Belum ditentukan"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        order.payment_proof ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.payment_proof ? "Bukti Upload" : "Belum Bayar"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Ringkasan Pesanan
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatPrice(parseFloat(order.total_price || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>{formatPrice(order.shipping?.cost || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(
                        parseFloat(order.total_price || 0) +
                          (order.shipping?.cost || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Hubungi Penjual
                </Button>
                {order.status === "delivered" && (
                  <Button className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Beli Lagi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Belum Ada Pesanan
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Anda belum pernah melakukan pemesanan. Mulai berbelanja sekarang dan
            temukan komponen elektronik terbaik untuk proyek Anda.
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Pesanan Saya
        </h1>
        <p className="text-muted-foreground">
          Kelola dan lacak semua pesanan Anda di sini
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nomor pesanan atau nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="processing">Diproses</option>
                <option value="shipping">Dikirim</option>
                <option value="delivered">Diterima</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">ORD-{order.id}</h3>
                      <Badge
                        variant={statusInfo.variant}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>
                          {order.items_count || 0} item (
                          {order.total_quantity || 0} qty)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>
                          {order.shipping?.method || "Belum ditentukan"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>
                          {order.payment?.method || "Belum ditentukan"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(parseFloat(order.total_price || 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(order.order_details || [])
                          .slice(0, 2)
                          .map(
                            (detail) =>
                              detail.product?.name || "Unknown Product"
                          )
                          .join(", ")}
                        {(order.order_details || []).length > 2 &&
                          ` +${(order.order_details || []).length - 2} lainnya`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate("/orders/" + order.id + "/details")
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    {order.shipping?.trackingNumber &&
                      order.status === "shipping" && (
                        <Button variant="default">
                          <Truck className="h-4 w-4 mr-2" />
                          Lacak
                        </Button>
                      )}
                    {order.status === "delivered" && (
                      <Button>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Beli Lagi
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Tidak Ada Pesanan Ditemukan
          </h3>
          <p className="text-muted-foreground">
            Coba ubah kriteria pencarian atau filter status pesanan
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
