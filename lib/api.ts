import type { GeneralSettingsData } from "@/app/dashboard/GeneralSettings";
import type { SocialSettingsData } from "@/app/dashboard/LinkSettings";
import type { ProjectSettingsData } from "@/app/dashboard/ProjectSettings";
import { useToast } from "@/components/ui/use-toast";

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("pfp", file);

  return fetch("/api/upload/pfp", {
    method: "POST",
    body: formData,
  });
}

export type UserSettingsData = GeneralSettingsData & SocialSettingsData & ProjectSettingsData;

export function saveUserSettings(data: UserSettingsData) {
  return fetch("/api/upload/settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function validateUserSettings(
  settings: Partial<UserSettingsData>,
  toast?: ReturnType<typeof useToast>,
): {
  valid: boolean;
  message?: string;
} {
  const PLATFORMS = ["twitter", "github", "linkedin", "dribbble", "behance"] as const;
  const userNameValid = settings.username && settings.username.length > 0;
  const roleValid = settings.role == null || settings.role.length < 48;
  const locationValid = settings.location == null || settings.location.length < 48;
  const bioValid = settings.bio == null || settings.bio.length < 256;
  const linksValid =
    settings.links != null &&
    settings.links.every((link) => {
      return link.username.length < 256 && PLATFORMS.includes(link.platform);
    });
  const projectsValid =
    settings.projects != null &&
    settings.projects.every((project) => {
      return (
        project.name.length < 64 &&
        (project.description === "" || project.description.length < 512) &&
        project.link.length < 1024 &&
        project.stack.length <= 10
      );
    });
  console.log(settings);
  console.log(projectsValid)

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

  if (!projectsValid) {
    toast?.toast({
      title: "Invalid project",
      description: "Please check the projects",
      variant: "destructive",
    });
    return {
      valid: false,
      message: "Invalid project",
    };
  }

  return {
    valid: true,
    message: "",
  };
}
