import { Separator } from "@/components/ui/separator";
import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react";

// Custom TikTok icon component since Lucide doesn't have it
const TikTokIcon = ({ className }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.349-2.017-1.349-3.284C16.392.517 15.875 0 15.238 0h-2.796c-.637 0-1.154.517-1.154 1.154v11.615c0 1.357-.551 2.588-1.441 3.478-.89.89-2.121 1.441-3.478 1.441s-2.588-.551-3.478-1.441c-.89-.89-1.441-2.121-1.441-3.478s.551-2.588 1.441-3.478c.89-.89 2.121-1.441 3.478-1.441.637 0 1.154-.517 1.154-1.154V4.9c0-.637-.517-1.154-1.154-1.154-3.731 0-6.769 3.038-6.769 6.769s3.038 6.769 6.769 6.769 6.769-3.038 6.769-6.769V8.206c1.283.814 2.769 1.283 4.385 1.283.637 0 1.154-.517 1.154-1.154V5.639c0-.637-.517-1.154-1.154-1.154-.518 0-1.012-.077-1.477-.226z" />
  </svg>
);

export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/URL_UR_FACEBOOK",
      icon: Facebook,
      hoverColor: "hover:text-blue-600",
    },
    {
      name: "TikTok",
      url: "https://tiktok.com/URL_UR_TIKTOK",
      icon: TikTokIcon,
      hoverColor: "hover:text-sky-500",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/URL_UR_YOUTUBE",
      icon: Youtube,
      hoverColor: "hover:text-red-600",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/URL_UR_LINKEDIN",
      icon: Linkedin,
      hoverColor: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/user/URL_UR_INSTAGRAM",
      icon: Instagram,
      hoverColor: "hover:text-orange-500",
    },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Copyright by{" "}
              <span className="font-semibold text-foreground">ProTech.id</span>
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-medium hidden sm:block">
              Follow Us
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground ${social.hoverColor} transition-all duration-200 hover:scale-110 hover:shadow-md`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Rumah komponen elektronik & robotika terpercaya di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
