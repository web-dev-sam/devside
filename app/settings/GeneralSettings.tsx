"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormDescription, FormItem } from "@/components/ui/form";

export type GeneralSettingsData = {
  username: string;
  role: string;
  location: string;
  bio: string;
  path: string;
};

export function GeneralSettings({
  serverUserName,
  serverRole,
  serverLocation,
  serverBio,
  serverPath,
  onChange,
}: {
  serverUserName: string;
  serverRole: string;
  serverLocation: string;
  serverBio: string;
  serverPath: string;
  onChange: (opts: GeneralSettingsData) => void;
}) {
  const [username, setUsername] = useState(serverUserName);
  const [role, setRole] = useState(serverRole);
  const [location, setLocation] = useState(serverLocation);
  const [bio, setBio] = useState(serverBio);
  const [path, setPath] = useState(serverPath);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (hasUnsavedChanges) {
      onChange({ username, role, location, bio, path });
    }
  }, [username, role, location, bio, path]); // eslint-disable-line react-hooks/exhaustive-deps

  // function onSaveOld() {
  //   if (!hasUnsavedChanges) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   username && formData.append("name", username);
  //   role && formData.append("role", role);
  //   location && formData.append("location", location);
  //   bio && formData.append("bio", bio);

  //   fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const { name, role, location, bio } = data;
  //       console.log("Saved:", { name, role, location, bio });

  //       setHasUnsavedChanges(false);
  //     })
  //     .catch((e) => {
  //       console.error("Failed to save changes", e);
  //       toast.toast({
  //         title: "Error",
  //         description: "Failed to save changes",
  //         variant: "destructive",
  //       });
  //     });
  // }

  return (
    <>
      <section className="w-full md:w-2/3 lg:w-1/2 mx-auto space-y-8">
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
            <div className="mb-8">
              <div className="flex gap-2">
                <div className="rounded-md bg-secondary px-3 py-2 text-secondary-foreground text-sm flex items-center">
                  https://devsi.de/
                </div>
                <Input
                  type="text"
                  id="path"
                  className="flex-1"
                  defaultValue={serverPath}
                  onInput={(e) => {
                    setHasUnsavedChanges(true);
                    setPath(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                type="text"
                id="name"
                defaultValue={serverUserName}
                onInput={(e) => {
                  setHasUnsavedChanges(true);
                  setUsername(e.currentTarget.value);
                }}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                type="text"
                id="role"
                defaultValue={serverRole}
                onInput={(e) => {
                  setHasUnsavedChanges(true);
                  setRole(e.currentTarget.value);
                }}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                defaultValue={serverLocation}
                onInput={(e) => {
                  setHasUnsavedChanges(true);
                  setLocation(e.currentTarget.value);
                }}
              />
            </div>
            <div>
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                defaultValue={serverBio}
                onInput={(e) => {
                  setHasUnsavedChanges(true);
                  setBio(e.currentTarget.value);
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
