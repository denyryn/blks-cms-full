import { Check, Circle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateGuestMessage } from "@/api-services/guest-message.service";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns = (onDataChange) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate max-w-xs">{row.original.message}</div>
        </TooltipTrigger>
        <TooltipContent sideOffset={5} className="max-w-sm">
          {row.original.message}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "is_read",
    header: "Status",
    cell: ({ row }) => {
      const isRead = row.original.is_read;

      return (
        <div
          className={cn(
            "border rounded-md select-none flex items-center justify-center gap-2 w-fit p-2 py-0.5",
            isRead ? "text-green-500" : "text-red-500"
          )}
        >
          <Circle
            className={cn(
              "size-2",
              isRead
                ? "text-green-500 fill-green-500"
                : "text-red-500 fill-red-500"
            )}
          />
          <span className="text-xs">{isRead ? "Read" : "Unread"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, name, is_read } = row.original;

      const toggleStatus = async (newStatus) => {
        const { response } = await updateGuestMessage({
          id,
          is_read: newStatus,
        });

        if (!response.ok) {
          toast.error("Failed to update guest-message status");
          return;
        }

        toast.success(
          `Message from ${name} with ID ${id} marked as ${
            newStatus ? "read" : "unread"
          }`
        );
        onDataChange?.();
      };

      /* Reusable toggle button */
      const StatusToggle = ({ targetStatus, Icon, label, hoverColor }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => toggleStatus(targetStatus)}
              className="group"
            >
              <Icon className={`size-4 ${hoverColor}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={2}>{label}</TooltipContent>
        </Tooltip>
      );

      return (
        <div className="flex items-center gap-1">
          {!is_read ? (
            <StatusToggle
              targetStatus={true}
              Icon={Check}
              label="Mark as Read"
              hoverColor="text-green-500"
            />
          ) : (
            <StatusToggle
              targetStatus={false}
              Icon={X}
              label="Mark as Unread"
              hoverColor="text-red-500"
            />
          )}
        </div>
      );
    },
  },
];
