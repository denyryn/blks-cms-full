import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/auth.context.jsx";
import { CartProvider } from "./contexts/cart.context.jsx";

import ErrorBoundary from "@/pages/errors/global.boundary";
import router from "@/routes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              <ErrorBoundary>
                <RouterProvider router={router} />
              </ErrorBoundary>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </>
  );
}
