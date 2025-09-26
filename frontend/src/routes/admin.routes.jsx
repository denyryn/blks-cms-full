import { Navigate } from "react-router";
import DashboardLayout from "@/layouts/dashboard.layout";
import HomePage from "@/pages/dashboard/home/page";
import CategoryPage from "@/pages/dashboard/category/page";
import ProductPage from "@/pages/dashboard/product/page";
import ProductEditCreatePage from "@/pages/dashboard/product/edit-create/page";
import OrderPage from "@/pages/dashboard/order/page";
import GuestMessagePage from "@/pages/dashboard/guest-message/page";

let adminRoutes = [
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      // Default route for dashboard
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: "home",
        Component: HomePage,
      },

      // Category
      {
        path: "category",
        Component: CategoryPage,
      },

      // Product
      {
        path: "product",
        Component: ProductPage,
      },
      {
        path: "product/create",
        Component: ProductEditCreatePage,
      },
      {
        path: "product/edit/:id",
        Component: ProductEditCreatePage,
      },

      // Order
      {
        path: "order",
        Component: OrderPage,
      },

      // Guest Message
      {
        path: "guest-message",
        Component: GuestMessagePage,
      },
    ],
  },
];

export default adminRoutes;
