import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Home,
  ArrowLeft,
  RefreshCw,
  Search,
  Server,
  Lock,
  Wifi,
  Clock,
} from "lucide-react";

// Error type configurations
const ERROR_CONFIGS = {
  404: {
    icon: Search,
    title: "Halaman Tidak Ditemukan",
    message:
      "Halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau tidak pernah ada.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    actions: ["home", "back"],
  },
  500: {
    icon: Server,
    title: "Kesalahan Server Internal",
    message:
      "Terjadi kesalahan pada server kami. Tim teknis sedang menangani masalah ini. Silakan coba lagi nanti.",
    color: "text-red-600",
    bgColor: "bg-red-50",
    actions: ["refresh", "home"],
  },
  403: {
    icon: Lock,
    title: "Akses Ditolak",
    message:
      "Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    actions: ["home", "back"],
  },
  401: {
    icon: Lock,
    title: "Akses Tidak Diizinkan",
    message:
      "Anda perlu masuk untuk mengakses halaman ini. Silakan masuk terlebih dahulu.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    actions: ["login", "home"],
  },
  503: {
    icon: Clock,
    title: "Layanan Tidak Tersedia",
    message:
      "Layanan sedang dalam pemeliharaan. Kami akan kembali online segera. Terima kasih atas kesabaran Anda.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    actions: ["refresh", "home"],
  },
  network: {
    icon: Wifi,
    title: "Masalah Koneksi",
    message:
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    actions: ["refresh", "back"],
  },
  default: {
    icon: AlertTriangle,
    title: "Terjadi Kesalahan",
    message:
      "Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi dukungan teknis jika masalah berlanjut.",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    actions: ["refresh", "home", "back"],
  },
};

const ACTION_CONFIGS = {
  home: {
    icon: Home,
    label: "Kembali ke Beranda",
    variant: "default",
    action: "navigate",
    path: "/",
  },
  back: {
    icon: ArrowLeft,
    label: "Kembali",
    variant: "outline",
    action: "back",
  },
  refresh: {
    icon: RefreshCw,
    label: "Muat Ulang",
    variant: "outline",
    action: "refresh",
  },
  login: {
    icon: Lock,
    label: "Masuk",
    variant: "default",
    action: "navigate",
    path: "/auth/login",
  },
};

export default function ErrorPage({
  errorType = "default",
  customTitle,
  customMessage,
  customActions,
  showCode = true,
  className = "",
}) {
  const navigate = useNavigate();

  // Get error configuration
  const config = ERROR_CONFIGS[errorType] || ERROR_CONFIGS.default;
  const ErrorIcon = config.icon;

  // Use custom values or defaults
  const title = customTitle || config.title;
  const message = customMessage || config.message;
  const actions = customActions || config.actions;

  const handleAction = (actionType) => {
    const actionConfig = ACTION_CONFIGS[actionType];
    if (!actionConfig) return;

    switch (actionConfig.action) {
      case "navigate":
        navigate(actionConfig.path);
        break;
      case "back":
        window.history.back();
        break;
      case "refresh":
        window.location.reload();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 ${className}`}
    >
      <div className="max-w-2xl w-full text-center">
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            {/* Error Icon */}
            <div
              className={`${config.bgColor} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6`}
            >
              <ErrorIcon className={`h-12 w-12 ${config.color}`} />
            </div>

            {/* Error Code */}
            {showCode && errorType !== "default" && errorType !== "network" && (
              <div className="mb-4">
                <span
                  className={`text-6xl md:text-8xl font-bold ${config.color} opacity-20`}
                >
                  {errorType}
                </span>
              </div>
            )}

            {/* Error Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {title}
            </h1>

            {/* Error Message */}
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {actions.map((actionType, index) => {
                const actionConfig = ACTION_CONFIGS[actionType];
                if (!actionConfig) return null;

                const ActionIcon = actionConfig.icon;

                return (
                  <Button
                    key={actionType}
                    variant={actionConfig.variant}
                    onClick={() => handleAction(actionType)}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <ActionIcon className="h-4 w-4" />
                    {actionConfig.label}
                  </Button>
                );
              })}
            </div>

            {/* Additional Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Butuh bantuan? Hubungi{" "}
                <a
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  tim dukungan kami
                </a>{" "}
                atau kembali ke{" "}
                <a
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  halaman utama
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Specific error components for common use cases
export function NotFoundPage(props) {
  return <ErrorPage errorType="404" {...props} />;
}

export function ServerErrorPage(props) {
  return <ErrorPage errorType="500" {...props} />;
}

export function ForbiddenPage(props) {
  return <ErrorPage errorType="403" {...props} />;
}

export function UnauthorizedPage(props) {
  return <ErrorPage errorType="401" {...props} />;
}

export function ServiceUnavailablePage(props) {
  return <ErrorPage errorType="503" {...props} />;
}

export function NetworkErrorPage(props) {
  return <ErrorPage errorType="network" {...props} />;
}
