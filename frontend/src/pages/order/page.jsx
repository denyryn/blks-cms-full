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
import { Link } from "react-router";

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample order data
  const [orders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-09-20",
      status: "delivered",
      total: 387000,
      items: [
        {
          id: 1,
          name: "Arduino Uno R3 Original",
          quantity: 2,
          price: 125000,
          image: "/src/assets/arduino-parts.jpg",
        },
        {
          id: 2,
          name: "Sensor Ultrasonik HC-SR04",
          quantity: 1,
          price: 25000,
          image: "/src/assets/arduino-parts.jpg",
        },
      ],
      shipping: {
        address: "Jl. Sudirman No. 123, Jakarta Pusat 10270",
        method: "JNE Reguler",
        cost: 12000,
        trackingNumber: "JNE1234567890",
      },
      payment: {
        method: "Transfer Bank BCA",
        status: "paid",
      },
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-18",
      status: "shipping",
      total: 167000,
      items: [
        {
          id: 3,
          name: "Breadboard 830 Lubang",
          quantity: 3,
          price: 15000,
          image: "/src/assets/arduino-parts.jpg",
        },
        {
          id: 4,
          name: "Jumper Wire Male-Female",
          quantity: 2,
          price: 12000,
          image: "/src/assets/arduino-parts.jpg",
        },
      ],
      shipping: {
        address: "Jl. Gatot Subroto No. 456, Jakarta Selatan 12920",
        method: "JNT Express",
        cost: 15000,
        trackingNumber: "JNT9876543210",
      },
      payment: {
        method: "QRIS",
        status: "paid",
      },
    },
    {
      id: "ORD-2024-003",
      date: "2024-09-15",
      status: "processing",
      total: 289000,
      items: [
        {
          id: 5,
          name: "ESP32 DevKit V1",
          quantity: 1,
          price: 89000,
          image: "/src/assets/arduino-parts.jpg",
        },
        {
          id: 6,
          name: "LCD 16x2 I2C",
          quantity: 2,
          price: 45000,
          image: "/src/assets/arduino-parts.jpg",
        },
      ],
      shipping: {
        address: "Jl. Thamrin No. 789, Jakarta Pusat 10350",
        method: "GoSend Same Day",
        cost: 25000,
        trackingNumber: null,
      },
      payment: {
        method: "Credit Card",
        status: "paid",
      },
    },
    {
      id: "ORD-2024-004",
      date: "2024-09-12",
      status: "cancelled",
      total: 156000,
      items: [
        {
          id: 7,
          name: "Servo Motor SG90",
          quantity: 4,
          price: 18000,
          image: "/src/assets/arduino-parts.jpg",
        },
        {
          id: 8,
          name: "Resistor Kit 1/4W",
          quantity: 1,
          price: 35000,
          image: "/src/assets/arduino-parts.jpg",
        },
      ],
      shipping: {
        address: "Jl. HR Rasuna Said No. 321, Jakarta Selatan 12940",
        method: "JNE Reguler",
        cost: 12000,
        trackingNumber: null,
      },
      payment: {
        method: "Transfer Bank Mandiri",
        status: "refunded",
      },
    },
  ]);

  const getStatusInfo = (status) => {
    const statusMap = {
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
    return statusMap[status] || statusMap.processing;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                      Pesanan pada {formatDate(order.date)}
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
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
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
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{order.shipping.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.shipping.method}</span>
                    </div>
                    {order.shipping.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {order.shipping.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Pembayaran</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.payment.method}</span>
                    </div>
                    <Badge
                      variant={
                        order.payment.status === "paid"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.payment.status === "paid" ? "Lunas" : "Refund"}
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
                      {formatCurrency(order.total - order.shipping.cost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>{formatCurrency(order.shipping.cost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(order.total)}
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
                      <h3 className="font-semibold text-lg">{order.id}</h3>
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
                        <span>{formatDate(order.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>{order.shipping.method}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{order.payment.method}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items
                          .slice(0, 2)
                          .map((item) => item.name)
                          .join(", ")}
                        {order.items.length > 2 &&
                          ` +${order.items.length - 2} lainnya`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    {order.shipping.trackingNumber &&
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
