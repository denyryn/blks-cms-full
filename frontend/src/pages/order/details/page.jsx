import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample order data (in real app, this would be fetched based on orderId)
  const sampleOrders = {
    "ORD-2024-001": {
      id: "ORD-2024-001",
      date: "2024-09-20",
      status: "delivered",
      total: 387000,
      deliveredDate: "2024-09-25",
      items: [
        {
          id: 1,
          name: "Arduino Uno R3 Original",
          quantity: 2,
          price: 125000,
          image: "/src/assets/arduino-parts.jpg",
          category: "Microcontroller",
          sku: "ARD-UNO-R3",
          description:
            "Arduino Uno R3 original dengan USB cable dan dokumentasi lengkap",
        },
        {
          id: 2,
          name: "Sensor Ultrasonik HC-SR04",
          quantity: 1,
          price: 25000,
          image: "/src/assets/arduino-parts.jpg",
          category: "Sensor",
          sku: "SNS-US-HC04",
          description:
            "Sensor jarak ultrasonik dengan akurasi tinggi untuk project robotika",
        },
        {
          id: 9,
          name: "Kabel USB A to B",
          quantity: 2,
          price: 12000,
          image: "/src/assets/arduino-parts.jpg",
          category: "Cable",
          sku: "CBL-USB-AB",
          description: "Kabel USB berkualitas tinggi untuk koneksi Arduino",
        },
      ],
      shipping: {
        address:
          "Jl. Sudirman No. 123, Blok A No. 5, RT 02/RW 05, Menteng, Jakarta Pusat 10270",
        recipient: "Ahmad Pratama",
        phone: "+62 812-3456-7890",
        method: "JNE Reguler",
        cost: 12000,
        trackingNumber: "JNE1234567890",
        estimatedDelivery: "2024-09-22",
        actualDelivery: "2024-09-25",
        courier: "Budi Santoso",
      },
      payment: {
        method: "Transfer Bank BCA",
        status: "paid",
        accountNumber: "1234567890",
        accountName: "PT. ProTech Indonesia",
        paidAt: "2024-09-20T14:30:00Z",
        amount: 387000,
      },
      timeline: [
        {
          status: "ordered",
          title: "Pesanan Dibuat",
          description: "Pesanan berhasil dibuat dan menunggu pembayaran",
          timestamp: "2024-09-20T10:00:00Z",
          completed: true,
        },
        {
          status: "paid",
          title: "Pembayaran Diterima",
          description: "Pembayaran telah dikonfirmasi dan diverifikasi",
          timestamp: "2024-09-20T14:30:00Z",
          completed: true,
        },
        {
          status: "processing",
          title: "Pesanan Diproses",
          description: "Pesanan sedang disiapkan dan dikemas",
          timestamp: "2024-09-21T09:00:00Z",
          completed: true,
        },
        {
          status: "shipped",
          title: "Pesanan Dikirim",
          description: "Pesanan telah dikirim melalui JNE Reguler",
          timestamp: "2024-09-22T16:00:00Z",
          completed: true,
        },
        {
          status: "delivered",
          title: "Pesanan Diterima",
          description: "Pesanan telah diterima oleh penerima",
          timestamp: "2024-09-25T11:30:00Z",
          completed: true,
        },
      ],
      notes: "Pesanan khusus untuk project sekolah. Mohon dikemas dengan baik.",
      invoice: {
        number: "INV-2024-001",
        downloadUrl: "/api/invoices/INV-2024-001.pdf",
      },
    },
    "ORD-2024-002": {
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
          category: "Prototyping",
          sku: "BRD-830",
          description: "Breadboard berkualitas tinggi dengan 830 tie points",
        },
        {
          id: 4,
          name: "Jumper Wire Male-Female",
          quantity: 2,
          price: 12000,
          image: "/src/assets/arduino-parts.jpg",
          category: "Wire",
          sku: "JMP-MF-40",
          description: "Set 40 pcs jumper wire male-female berkualitas",
        },
      ],
      shipping: {
        address:
          "Jl. Gatot Subroto No. 456, Apartment Green Bay Tower A Lt. 15, Jakarta Selatan 12920",
        recipient: "Sari Wulandari",
        phone: "+62 821-9876-5432",
        method: "JNT Express",
        cost: 15000,
        trackingNumber: "JNT9876543210",
        estimatedDelivery: "2024-09-21",
      },
      payment: {
        method: "QRIS",
        status: "paid",
        paidAt: "2024-09-18T16:45:00Z",
        amount: 167000,
      },
      timeline: [
        {
          status: "ordered",
          title: "Pesanan Dibuat",
          description: "Pesanan berhasil dibuat dan menunggu pembayaran",
          timestamp: "2024-09-18T15:00:00Z",
          completed: true,
        },
        {
          status: "paid",
          title: "Pembayaran Diterima",
          description: "Pembayaran via QRIS berhasil dikonfirmasi",
          timestamp: "2024-09-18T16:45:00Z",
          completed: true,
        },
        {
          status: "processing",
          title: "Pesanan Diproses",
          description: "Pesanan sedang disiapkan dan dikemas",
          timestamp: "2024-09-19T08:30:00Z",
          completed: true,
        },
        {
          status: "shipped",
          title: "Pesanan Dikirim",
          description: "Pesanan telah dikirim melalui JNT Express",
          timestamp: "2024-09-20T14:00:00Z",
          completed: true,
        },
        {
          status: "delivered",
          title: "Pesanan Diterima",
          description: "Pesanan dalam perjalanan ke alamat tujuan",
          timestamp: null,
          completed: false,
        },
      ],
      notes: null,
      invoice: {
        number: "INV-2024-002",
        downloadUrl: "/api/invoices/INV-2024-002.pdf",
      },
    },
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundOrder = sampleOrders[orderId];
      setOrder(foundOrder || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [orderId]);

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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTrackPackage = () => {
    // In a real app, this would redirect to the courier's tracking page
    window.open(
      `https://www.jne.co.id/id/tracking/trace/${order.shipping.trackingNumber}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
              {order.id}
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
            Dipesan pada {formatDate(order.date)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Timeline */}
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

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Produk yang Dipesan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                      <h4 className="font-medium text-lg mb-2">{item.name}</h4>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price)} / pcs
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {formatCurrency(item.price * item.quantity)}
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
          {order.notes && (
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
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {order.shipping.trackingNumber && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleTrackPackage}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Lacak Paket
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi Penjual
              </Button>
              {order.status === "delivered" && (
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
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      {order.shipping.recipient}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{order.shipping.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">
                      {order.shipping.address}
                    </span>
                  </div>
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
                      {order.shipping.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ongkos Kirim</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(order.shipping.cost)}
                    </span>
                  </div>
                  {order.shipping.trackingNumber && (
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
                  {order.shipping.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-sm">Est. Tiba</span>
                      <span className="text-sm">
                        {formatDate(order.shipping.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                  {order.shipping.actualDelivery && (
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
                      {order.payment.method}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status</span>
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
                  {order.payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-sm">Dibayar</span>
                      <span className="text-sm">
                        {formatDateTime(order.payment.paidAt)}
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
                      {formatCurrency(order.shipping.cost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(order.total)}
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
