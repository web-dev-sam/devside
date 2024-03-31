import { GeneralSettingsData } from "@/app/dashboard/GeneralSettings";
import { SocialSettingsData } from "@/app/dashboard/LinkSettings";


export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("pfp", file);

  return fetch("/api/upload/pfp", {
    method: "POST",
    body: formData,
  });
}

export function saveUserSettings(data: GeneralSettingsData & SocialSettingsData) {
  return fetch("/api/upload/settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}