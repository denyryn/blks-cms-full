import { createBrowserRouter } from "react-router";

import publicRoutes from "./public.routes";
import adminRoutes from "./admin.routes";
import privateRoutes from "./private.routes";

let router = createBrowserRouter([
  // Public Routes (unauthenticated)
  ...publicRoutes,

  // Private Routes (authenticated)
  ...privateRoutes,

  // Admin Routes
  ...adminRoutes,
]);

export default router;
