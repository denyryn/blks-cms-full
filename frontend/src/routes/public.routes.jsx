import AuthLayout from "@/layouts/auth.layout";
import GuestLayout from "@/layouts/guest.layout";
import AboutPage from "@/pages/about/page";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ContactPage from "@/pages/contact/page";
import LandingPage from "@/pages/landing/page";
import ProductDetailsPage from "@/pages/product/details/page";
import ProductPage from "@/pages/product/page";
import ServicePage from "@/pages/service/page";

import { Navigate } from "react-router";

let publicRoutes = [
  {
    path: "/",
    Component: GuestLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            Component: ProductPage,
          },
          {
            path: ":id",
            Component: ProductDetailsPage,
          },
        ],
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "services",
        Component: ServicePage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
    ],
  },
  {
    path: "/login",
    element: <Navigate to="/auth/login" />,
  },
  {
    path: "/register",
    element: <Navigate to="/auth/register" />,
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        navigator: "/auth/login",
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
    ],
  },
];

export default publicRoutes;
