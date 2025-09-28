import { useState } from "react";
import { useNavigate } from "react-router";
import { User, MapPin, Settings, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileInformation } from "./components/profile-information";
import { AddressesInformation } from "./components/addresses-information";
import { useAuth, useLogout } from "@/hooks/queries/auths.query";
import { useUserAddresses } from "@/hooks/queries/user-addresses.query";

export default function UserPage() {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { data: addresses, isLoading: isAddressLoading } = useUserAddresses();

  const logout = useLogout();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = "/";
  };

  // Show loading spinner while auth is loading
  if (isUserLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="mb-6">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Akses Terbatas
            </h2>
            <p className="text-muted-foreground mb-6">
              Anda perlu masuk untuk mengakses halaman profil
            </p>
          </div>
          <div className="space-x-4">
            <Button onClick={() => navigate("/auth/login")} size="lg">
              Masuk ke Akun
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth/register")}
              size="lg"
            >
              Daftar Akun Baru
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil dan alamat pengiriman Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Card */}
          <ProfileInformation user={user} />

          {/* Address Info & Management */}
          <AddressesInformation user={user} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Pesanan
                </span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Alamat Tersimpan
                </span>
                {isAddressLoading ? (
                  <span className="font-semibold">Loading...</span>
                ) : (
                  <span className="font-semibold">{addresses.length}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Member Sejak
                </span>
                <span className="font-semibold text-xs">
                  {new Date(user.created_at).getFullYear()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menu Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan Akun
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Kelola Alamat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Ubah Profil
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
