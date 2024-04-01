import { GeneralSettingsData } from "@/app/dashboard/GeneralSettings";
import { PLATFORMS, SocialSettingsData } from "@/app/dashboard/LinkSettings";
import { useToast } from "@/components/ui/use-toast";

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("pfp", file);

  return fetch("/api/upload/pfp", {
    method: "POST",
    body: formData,
  });
}

export type UserSettingsData = GeneralSettingsData & SocialSettingsData;

export function saveUserSettings(data: UserSettingsData) {
  return fetch("/api/upload/settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function validateUserSettings(
  settings: UserSettingsData,
  toast?: ReturnType<typeof useToast>,
): {
  valid: boolean;
  message?: string;
} {
  const userNameValid = settings.username.length > 0;
  const roleValid = settings.role.length < 48;
  const locationValid = settings.location.length < 48;
  const bioValid = settings.bio.length < 256;
  const linksValid = settings.links.every((link) => {
    return link.username.length < 256 && PLATFORMS.includes(link.platform);
  });

  if (!userNameValid) {
    toast?.toast({
      title: "Username is required",
      description: "Please enter a username",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Username is required",
    };
  }

  if (!roleValid) {
    toast?.toast({
      title: "Role is too long",
      description: "Role must be less than 48 characters",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Role is too long",
    };
  }

  if (!locationValid) {
    toast?.toast({
      title: "Location is too long",
      description: "Location must be less than 48 characters",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Location is too long",
    };
  }

  if (!bioValid) {
    toast?.toast({
      title: "Bio is too long",
      description: "Bio must be less than 256 characters",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Bio is too long",
    };
  }

  if (!linksValid) {
    toast?.toast({
      title: "Invalid social link",
      description: "Please check the social links",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Invalid social link",
    };
  }

  return {
    valid: true,
    message: "",
  };
}
