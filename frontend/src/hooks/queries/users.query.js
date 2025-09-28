// src/hooks/queries/adminUser.js
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "@/api-services/users.service";

/* ---------- QUERIES ---------- */

// GET /api/admin/users (paginated list)
export const useAdminUsers = ({ page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["admin", "users", page, perPage],
    queryFn: () => getUsers({ page, perPage }),
    keepPreviousData: true,
  });

// GET /api/admin/users/:id (single user)
export const useAdminUser = (id) =>
  useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

// Infinite-scroll version (optional)
export const useAdminUsersInfinite = ({ perPage = 10 } = {}) =>
  useInfiniteQuery({
    queryKey: ["admin", "users", "infinite"],
    queryFn: ({ pageParam = 1 }) => getUsers({ page: pageParam, perPage }),
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });

/* ---------- MUTATIONS ---------- */

// PUT /api/admin/users/:id
export const useAdminUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "users", id] });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

// DELETE /api/admin/users/:id
export const useAdminDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};
