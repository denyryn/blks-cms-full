import GuestLayout from "@/layouts/guest.layout";
import CartPage from "@/pages/cart/page";
import HomePage from "@/pages/dashboard/category/page";
import OrderDetailsPage from "@/pages/order/details/page";
import OrderPage from "@/pages/order/page";
import UserPage from "@/pages/user/page";

let privateRoutes = [
  {
    path: "/dashboard",
    Component: HomePage,
  },
  {
    path: "/",
    Component: GuestLayout,
    children: [
      {
        path: "user",
        Component: UserPage,
      },
      { path: "cart", Component: CartPage },
      {
        path: "orders",
        children: [
          {
            index: true,
            Component: OrderPage,
          },
          {
            path: "details",
            Component: OrderDetailsPage,
          },
        ],
      },
    ],
  },
];

export default privateRoutes;
