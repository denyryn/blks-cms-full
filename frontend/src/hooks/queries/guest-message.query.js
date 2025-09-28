// src/hooks/queries/guestMessage.js
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getGuestMessages,
  getGuestMessage,
  storeGuestMessage,
  updateGuestMessage,
  deleteGuestMessage,
} from "@/api-services/guest-message.service";

/* ---------- QUERIES ---------- */

// GET /api/admin/guest-messages (paginated)
export const useGuestMessages = ({ page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["guest-messages", page, perPage],
    queryFn: () => getGuestMessages({ page, perPage }),
    keepPreviousData: true,
  });

// GET /api/admin/guest-messages/:id (single)
export const useGuestMessage = (id) =>
  useQuery({
    queryKey: ["guest-messages", id],
    queryFn: () => getGuestMessage(id),
    enabled: !!id,
  });

// Infinite-scroll version (optional)
export const useGuestMessagesInfinite = ({ perPage = 10 } = {}) =>
  useInfiniteQuery({
    queryKey: ["guest-messages", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getGuestMessages({ page: pageParam, perPage }),
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/guest-messages (public contact form)
export const useStoreGuestMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeGuestMessage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guest-messages"] }),
  });
};

// PUT /api/admin/guest-messages/:id  (mark as read, etc.)
export const useUpdateGuestMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateGuestMessage,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["guest-messages", id] });
      qc.invalidateQueries({ queryKey: ["guest-messages"] });
    },
  });
};

// DELETE /api/admin/guest-messages/:id
export const useDeleteGuestMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGuestMessage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guest-messages"] }),
  });
};
