import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Edit, Mail, Phone, Save, User, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserProfileModal } from "@/components/user-side-components/profile/data-profile-modal";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/queries/auths.query";

export function ProfileInformation({ user }) {
  const { refetch } = useAuth();

  const triggerEditProfile = () => (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Profil
          </CardTitle>

          <UserProfileModal
            triggerElement={triggerEditProfile()}
            initialProfile={{ ...user }}
            onSuccess={refetch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {renderAvatar(user)}
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {user.name || "-"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {`Bergabung sejak ${formatDate(user.created_at)}`}
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
                  {user.name || "-"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground font-medium">
                    {user.email || "-"}
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
                    {user.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderAvatar(user) {
  return (
    <Avatar className="size-20">
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{getAvatarInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

const getAvatarInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
};
