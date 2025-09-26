import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/category/data-category-modal";
import { CategoryAlert } from "@/components/category/data-category-alert";

export const columns = (onDataChange) => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;

      function editTrigger() {
        return (
          <Button variant="ghost">
            <Edit className="size-4" />
          </Button>
        );
      }

      function deleteTrigger() {
        return (
          <Button variant="ghost" className="hover:text-destructive">
            <Trash className="size-4" />
          </Button>
        );
      }
      return (
        <div className="flex gap-2 items-center">
          <CategoryModal
            initial={formData}
            trigger={editTrigger()}
            onSuccess={onDataChange}
          />
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
