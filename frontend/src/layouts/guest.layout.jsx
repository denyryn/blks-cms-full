import { Outlet } from "react-router";
import Navbar from "@/components/user-side-components/navbar";
import Footer from "@/components/user-side-components/footer";

export default function GuestLayout() {
  return (
    <>
      <Navbar />
      <div className="bg-background min-h-svh lg:p-10">
        <div className="w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
