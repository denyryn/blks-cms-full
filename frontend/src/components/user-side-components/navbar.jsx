import { ShoppingCart, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth.context";
import Logo from "@/assets/logo.png";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemsCount = 4; // This would come from your cart context/state

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Create avatar initials from name (first 2 characters)
  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name.trim().slice(0, 2).toUpperCase();
  };

  const NavItems = [
    { name: "Beranda", path: "/" },
    { name: "Produk", path: "/products" },
    { name: "Tentang Kami", path: "/about" },
    { name: "Layanan", path: "/services" },
    { name: "Kontak", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <img
              src={Logo}
              alt="ProTech Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-bold text-foreground hidden sm:block">
              {config.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {NavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </Badge>
              )}
              <span className="sr-only">Keranjang Belanja</span>
            </Button>

            {/* User Profile Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
              onClick={() => navigate("/user")}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profil Pengguna</span>
            </Button>

            {/* Authentication Actions */}
            {isAuthenticated ? (
              /* User Profile Dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`h-full w-full flex items-center justify-center ${
                          user?.avatar ? "hidden" : "flex"
                        }`}
                      >
                        <span className="text-xs font-bold text-primary">
                          {getAvatarInitials(user?.name)}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/user")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Pesanan Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/user")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Login/Register Buttons for Guests */
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Masuk
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Daftar
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 py-4 space-y-1">
              {NavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Cart Link */}
              <div className="pt-2 mt-2 border-t">
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Keranjang Belanja</span>
                  {cartItemsCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>

                {/* Mobile User Profile Link */}
                <Link
                  to="/user"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Profil Pengguna</span>
                </Link>
              </div>

              {/* Mobile Authentication Section */}
              <div className="pt-2 mt-2 border-t">
                {isAuthenticated ? (
                  /* Authenticated User Menu */
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-full w-full flex items-center justify-center ${
                            user?.avatar ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-xs font-bold text-primary">
                            {getAvatarInitials(user?.name)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/user"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Profil</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Pesanan Saya</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  /* Guest User Menu */
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
