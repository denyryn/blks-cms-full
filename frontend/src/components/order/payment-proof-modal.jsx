import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, X, Download, Calendar, User } from "lucide-react";

export function PaymentProofModal({ triggerElement, order }) {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const paymentProofUrl = order?.payment_proof;
  const hasPaymentProof =
    paymentProofUrl &&
    paymentProofUrl !== "null" &&
    paymentProofUrl.trim() !== "";

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const handleDownload = () => {
    if (hasPaymentProof) {
      const link = document.createElement("a");
      link.href = paymentProofUrl;
      link.download = `payment-proof-order-${order.id}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      locale: "id-ID",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Bukti Pembayaran - Order #{order?.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{order?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Tanggal Order</p>
                    <p className="font-medium">
                      {formatDate(order?.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(order?.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Pembayaran</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(order?.total_price || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Status: {order?.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof Image */}
          <div className="space-y-4">
            {!hasPaymentProof ? (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Belum ada bukti pembayaran
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Customer belum mengupload bukti pembayaran untuk order
                        ini
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Tutup
                  </Button>
                </div>

                {/* Image Container */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      {!imageLoaded && !imageError && (
                        <div className="w-full h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground animate-pulse" />
                        </div>
                      )}

                      {imageError && (
                        <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <X className="h-12 w-12 text-red-500 mx-auto" />
                            <p className="text-muted-foreground">
                              Gagal memuat gambar
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Periksa koneksi internet atau file mungkin rusak
                            </p>
                          </div>
                        </div>
                      )}

                      <img
                        src={paymentProofUrl}
                        alt={`Bukti pembayaran order #${order?.id}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        className={`w-full max-h-[70vh] object-contain rounded-lg border ${
                          imageLoaded ? "block" : "hidden"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
