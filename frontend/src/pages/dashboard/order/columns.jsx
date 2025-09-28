import { Edit, Trash, Eye, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/category/data-category-modal";
import { CategoryAlert } from "@/components/category/data-category-alert";
import { PaymentProofModal } from "@/components/order/payment-proof-modal";
import { updateOrderStatus } from "@/api-services/orders.service";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const columns = (onDataChange) => [
  {
    accessorKey: "user.name",
    header: "User's Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const amount = row.original.total_price;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        pending: {
          label: "Menunggu",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
        confirmed: {
          label: "Dikonfirmasi",
          className: "bg-green-100 text-green-800 border-green-200",
        },
        rejected: {
          label: "Ditolak",
          className: "bg-red-100 text-red-800 border-red-200",
        },
        completed: {
          label: "Selesai",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        },
      };

      const config = statusConfig[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      };

      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-md border ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "payment_proof",
    header: "Payment Proof",
    cell: ({ row }) => {
      const order = row.original;
      const hasPaymentProof =
        order?.payment_proof &&
        order.payment_proof !== "null" &&
        order.payment_proof.trim() !== "";

      if (!hasPaymentProof) {
        return (
          <span className="text-muted-foreground text-sm">Belum ada bukti</span>
        );
      }

      return (
        <PaymentProofModal
          order={order}
          triggerElement={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Lihat Bukti
            </Button>
          }
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const navigate = useNavigate();

      const handleStatusUpdate = async (newStatus) => {
        try {
          const { response, data } = await updateOrderStatus({
            id: order.id,
            status: newStatus,
          });

          if (response.ok) {
            toast.success(
              `Order berhasil ${
                newStatus === "confirmed" ? "dikonfirmasi" : "ditolak"
              }`
            );
            // Trigger data refresh if callback is provided
            if (onDataChange) {
              onDataChange();
            }
          } else {
            toast.error(data?.message || "Gagal mengupdate status order");
          }
        } catch (error) {
          toast.error("Terjadi kesalahan saat mengupdate status");
          console.error("Error updating order status:", error);
        }
      };

      const canConfirm =
        order.status !== "confirmed" && order.status !== "rejected";
      const canReject =
        order.status !== "rejected" && order.status !== "confirmed";

      return (
        <div className="flex gap-2 items-center">
          {canConfirm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate("confirmed")}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
              Konfirmasi
            </Button>
          )}

          {canReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate("rejected")}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Tolak
            </Button>
          )}

          {(order.status === "confirmed" || order.status === "rejected") && (
            <span className="text-sm text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
              {order.status === "confirmed" ? "Dikonfirmasi" : "Ditolak"}
            </span>
          )}
        </div>
      );
    },
  },
];
