"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type GeneralSettingsData = {
  username: string;
  role: string;
  location: string;
  bio: string;
};

export function GeneralSettings({
  serverUserName,
  serverRole,
  serverLocation,
  serverBio,
  onChange,
}: {
  serverUserName: string;
  serverRole: string;
  serverLocation: string;
  serverBio: string;
  onChange: (opts: GeneralSettingsData) => void;
}) {
  const [username, setUsername] = useState(serverUserName);
  const [role, setRole] = useState(serverRole);
  const [location, setLocation] = useState(serverLocation);
  const [bio, setBio] = useState(serverBio);

  useEffect(() => {
    onChange({ username, role, location, bio });
  }, [username, role, location, bio]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <section className="max-w-xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
            <div>
              <Label htmlFor="pfp" className="sr-only">
                Profile Image
              </Label>
              <Input type="file" id="pfp" placeholder="shadcn" className="sr-only" />
            </div>
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Jeff Bezos"
                defaultValue={serverUserName}
                onInput={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                type="text"
                id="role"
                placeholder="Potato Peeler"
                defaultValue={serverRole}
                onInput={(e) => setRole(e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                placeholder="Canada"
                defaultValue={serverLocation}
                onInput={(e) => setLocation(e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                placeholder="e.g. What inspires you?"
                defaultValue={serverBio}
                onInput={(e) => setBio(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
