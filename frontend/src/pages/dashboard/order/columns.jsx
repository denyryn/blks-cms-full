import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/category/data-category-modal";
import { CategoryAlert } from "@/components/category/data-category-alert";
import { useNavigate } from "react-router";

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
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "shipping_address",
    header: "Shipping Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      const navigate = useNavigate();

      function deleteTrigger() {
        return (
          <Button variant="ghost" className="hover:text-destructive">
            <Trash className="size-4" />
          </Button>
        );
      }
      return (
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            onClick={() => {
              navigate(`/dashboard/product/edit/${row.original.id}`);
            }}
          >
            <Edit className="size-4" />
          </Button>

          <CategoryAlert
            category={formData}
            trigger={deleteTrigger()}
            onConfirm={onDataChange}
            onSuccess={onDataChange}
          />
        </div>
      );
    },
  },
];
