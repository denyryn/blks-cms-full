import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Settings,
  Camera,
  Save,
  X,
  LogOut,
} from "lucide-react";

export default function UserPage() {
  const {
    user: authUser,
    loading: authLoading,
    isAuthenticated,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  // Initialize all state hooks BEFORE any conditional logic
  const [user, setUser] = useState({
    id: authUser?.id || 1,
    name: authUser?.name || "User",
    email: authUser?.email || "user@email.com",
    phone: authUser?.phone || "+62 812-3456-7890",
    avatar: authUser?.avatar || null, // No fallback avatar URL
    joinDate: authUser?.created_at || "2024-01-15",
  });

  // Create avatar initials from name (first 2 characters)
  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name.trim().slice(0, 2).toUpperCase();
  };

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Rumah",
      recipientName: "John Doe",
      phone: "+62 812-3456-7890",
      address: "Jl. Merdeka No. 123, RT 01/RW 02",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postalCode: "10110",
      isDefault: true,
    },
    {
      id: 2,
      label: "Kantor",
      recipientName: "John Doe",
      phone: "+62 812-3456-7890",
      address: "Jl. Sudirman No. 456, Lantai 10",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      isDefault: false,
    },
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({
    id: authUser?.id || 1,
    name: authUser?.name || "User",
    email: authUser?.email || "user@email.com",
    phone: authUser?.phone || "+62 812-3456-7890",
    avatar: authUser?.avatar || null,
    joinDate: authUser?.created_at || "2024-01-15",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    recipientName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditingProfile(false);
    // Here you would typically make an API call to update the profile
  };

  const handleCancelEditProfile = () => {
    setEditedUser(user);
    setIsEditingProfile(false);
  };

  const handleAddAddress = () => {
    const id = Math.max(...addresses.map((a) => a.id)) + 1;
    const addressToAdd = {
      ...newAddress,
      id,
      isDefault: addresses.length === 0 ? true : newAddress.isDefault,
    };

    // If setting as default, unset other defaults
    if (addressToAdd.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, addressToAdd]);
    setNewAddress({
      label: "",
      recipientName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      isDefault: false,
    });
    setIsAddingAddress(false);
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id) => {
    const addressToDelete = addresses.find((addr) => addr.id === id);
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));

    // If deleted address was default and there are other addresses, make first one default
    if (addressToDelete?.isDefault && addresses.length > 1) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setTimeout(() => {
          handleSetDefaultAddress(remainingAddresses[0].id);
        }, 0);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Profil
                </CardTitle>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEditProfile}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            user.avatar ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-2xl font-bold text-primary">
                            {getAvatarInitials(user.name)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bergabung sejak{" "}
                        {new Date(user.joinDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Nama Lengkap
                        </Label>
                        <p className="text-foreground font-medium">
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Email
                        </Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-foreground font-medium">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Nomor Telepon
                        </Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-foreground font-medium">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                        {editedUser.avatar ? (
                          <img
                            src={editedUser.avatar}
                            alt={editedUser.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            editedUser.avatar ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-2xl font-bold text-primary">
                            {getAvatarInitials(editedUser.name)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Edit Profil
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Perbarui informasi profil Anda
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          value={editedUser.phone}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address Management */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Alamat Pengiriman ({addresses.length})
                </CardTitle>
                <Dialog
                  open={isAddingAddress}
                  onOpenChange={setIsAddingAddress}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Alamat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Alamat Baru</DialogTitle>
                      <DialogDescription>
                        Lengkapi informasi alamat pengiriman Anda
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="label">Label Alamat</Label>
                        <Input
                          id="label"
                          placeholder="Contoh: Rumah, Kantor"
                          value={newAddress.label}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              label: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipientName">Nama Penerima</Label>
                        <Input
                          id="recipientName"
                          value={newAddress.recipientName}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              recipientName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          value={newAddress.postalCode}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              postalCode: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Textarea
                          id="address"
                          placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Kota/Kabupaten</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                          id="province"
                          value={newAddress.province}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              province: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              isDefault: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Jadikan alamat utama</span>
                      </label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Batal
                      </Button>
                      <Button onClick={handleAddAddress}>Simpan Alamat</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              address.isDefault ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {address.label}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Utama
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-foreground">
                            {address.recipientName}
                          </p>
                          <p className="text-muted-foreground">
                            {address.phone}
                          </p>
                          <p className="text-muted-foreground">
                            {address.address}
                          </p>
                          <p className="text-muted-foreground">
                            {address.city}, {address.province}{" "}
                            {address.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Set Utama
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAddressId(address.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Alamat</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus alamat "
                                {address.label}"? Tindakan ini tidak dapat
                                dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAddress(address.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Belum ada alamat tersimpan
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tambahkan alamat untuk memudahkan pengiriman
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
                <span className="font-semibold">{addresses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Member Sejak
                </span>
                <span className="font-semibold text-xs">
                  {new Date(user.joinDate).getFullYear()}
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
