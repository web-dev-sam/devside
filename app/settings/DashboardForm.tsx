"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { GeneralSettings, type GeneralSettingsData } from "./GeneralSettings";
import { LinkSettings, PLATFORMS, SocialLink, SocialSettingsData } from "./LinkSettings";
import { ProjectSettings, ProjectSettingsData } from "./ProjectSettings";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debounceImmediate, useHasHydrated } from "@/lib/utils";
import { Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { saveUserSettings, uploadProfileImage, validateUserSettings } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/models/User";

export default function DashboardForm({
  serverUserName,
  serverPfp,
  serverRole,
  serverLocation,
  serverBio,
  serverSocialLinks,
  serverProjects,
  serverPath,
}: {
  serverUserName: string;
  serverPfp: string;
  serverRole: string;
  serverLocation: string;
  serverBio: string;
  serverPath: string;
  serverSocialLinks: IUser["socialLinks"];
  serverProjects: IUser["projects"];
}) {
  const hasHydrated = useHasHydrated();
  const TABS = ["general", "socials", "projects"];
  const defaultTab =
    typeof location !== "undefined" && TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "general";
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [pfp, setPfp] = useState(serverPfp);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const toast = useToast();

  const [generalData, setGeneralData] = useState<GeneralSettingsData>({
    username: serverUserName,
    role: serverRole,
    location: serverLocation,
    bio: serverBio,
    path: serverPath,
  });
  const [socialData, setSocialData] = useState<SocialSettingsData>({
    links: serverSocialLinks,
  });
  const [projectsData, setProjectsData] = useState<ProjectSettingsData>({
    projects: serverProjects as ProjectSettingsData["projects"],
  });

  useEffect(() => {
    location.hash = currentTab;
  }, [currentTab]);

  useEffect(() => {
    if (unsavedChanges) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [unsavedChanges]);

  function onGeneralChange(data: GeneralSettingsData) {
    setGeneralData(data);
    setUnsavedChanges(true);
  }

  function onSocialChange(data: SocialSettingsData) {
    setSocialData(data);
    setUnsavedChanges(true);
  }

  function onProjectChange(data: any) {
    setProjectsData(data);
    setUnsavedChanges(true);
  }

  async function onSave() {
    const settings = {
      ...generalData,
      ...socialData,
      ...projectsData,
    };

    console.log("Saving", settings);
    const { valid } = validateUserSettings(settings, toast);
    if (!valid) {
      setUnsavedChanges(true);
      return;
    }

    saveUserSettings(settings)
      .then(async (res) => {
        if (!res.ok) {
          setUnsavedChanges(true);
          toast.toast({
            title: "Error",
            description: await res.json().then((data) => data.error),
            variant: "destructive",
          });
          return;
        }

        setUnsavedChanges(false);
        toast.toast({
          title: "Success",
          description: "Settings saved successfully.",
        });
      })
      .catch((err) => {
        setUnsavedChanges(true);
        console.log("RIP4");
        toast.toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        });
      });

    setUnsavedChanges(false);
  }

  async function onPfpChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const [uploadResult, base64Result] = await Promise.allSettled([
      uploadProfileImage(file),
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result !== "string") {
            resolve(null);
            return;
          }
          resolve(result);
        };
        reader.onerror = (e) => {
          resolve(null);
        };
        reader.onabort = (e) => {
          resolve(null);
        };
        reader.readAsDataURL(file);
      }) as Promise<string | null>,
    ]);

    if (uploadResult.status === "rejected") {
      console.error("Failed to upload profile image.");
      toast.toast({
        title: "Error",
        description: "Failed to upload profile image.",
        variant: "destructive",
      });
      return;
    }

    if (!uploadResult.value.ok) {
      console.error("Failed to upload profile image.");
      toast.toast({
        title: "Error",
        description: await uploadResult.value.json().then((res) => res.error),
        variant: "destructive",
      });
      return;
    }

    if (base64Result.status === "fulfilled" && base64Result.value) {
      setPfp(base64Result.value);
    } else {
      setPfp(await uploadResult.value.json().then((data) => data.image));
    }
  }

  if (!hasHydrated) {
    return <></>;
  }

  return (
    <>
      <main className="p-4 md:p-8 pb-24 text-center">
        <div
          className="relative my-28 w-32 mx-auto rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => {
            document.getElementById("pfp")?.click();
          }}
        >
          <Input type="file" accept="image/*" className="hidden" id="pfp" onChange={(e) => onPfpChange(e)} />
          <Image
            src={pfp}
            width={128}
            height={128}
            alt="Your Profile Picture"
            priority={true}
            className="w-32 h-32 object-cover object-center"
          />
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <div className="absolute inset-0 bg-[#00000090]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4">
              <Pen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <Tabs defaultValue={currentTab} className="mx-auto">
          <TabsList className="mb-4">
            <TabsTrigger value="general" onClick={() => setCurrentTab("general")}>
              General
            </TabsTrigger>
            <TabsTrigger value="socials" onClick={() => setCurrentTab("socials")}>
              Socials
            </TabsTrigger>
            <TabsTrigger value="projects" onClick={() => setCurrentTab("projects")}>
              Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent forceMount value="general" hidden={currentTab !== "general"}>
            <GeneralSettings
              serverUserName={serverUserName}
              serverRole={serverRole}
              serverLocation={serverLocation}
              serverBio={serverBio}
              serverPath={serverPath}
              onChange={(data) => onGeneralChange(data)}
            />
          </TabsContent>
          <TabsContent forceMount value="socials" hidden={currentTab !== "socials"}>
            <LinkSettings serverLinks={serverSocialLinks} onChange={(data) => onSocialChange(data)} />
          </TabsContent>
          <TabsContent forceMount value="projects" hidden={currentTab !== "projects"}>
            <ProjectSettings serverProjects={serverProjects} onChange={(data) => onProjectChange(data)} />
          </TabsContent>
        </Tabs>
        <div>
          <Button disabled={!unsavedChanges} onClick={() => debounceImmediate(onSave, 300)()} className="my-28">
            Save
          </Button>
        </div>
      </main>
    </>
  );
}
