"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { FancyMultiSelect } from "./MultiSelect";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const socials = [
  {
    value: "twitter",
    label: "Twitter",
  },
  {
    value: "github",
    label: "GitHub",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "dribbble",
    label: "Dribbble",
  },
  {
    value: "behance",
    label: "Behance",
  },
];

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(32, {
      message: "Username must be at most 32 characters.",
    }),
  pfp: typeof window === "undefined" ? z.any().optional() : z.instanceof(FileList).optional(),
  role: z
    .string()
    .max(32, {
      message: "Role must be at most 32 characters.",
    })
    .optional(),
  location: z
    .string()
    .max(48, {
      message: "Location must be at most 48 characters.",
    })
    .optional(),
  bio: z
    .string()
    .max(256, {
      message: "Bio must be at most 256 characters.",
    })
    .optional(),
});

export default function DashboardForm({
  userName,
  pfp,
  role,
  location,
  bio,
}: {
  userName: string;
  pfp: string;
  role: string;
  location: string;
  bio: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { toast } = useToast();
  const [lastSavedProfileData, setLastSavedProfileData] = useState({
    username: userName,
    role: role,
    location: location,
    bio: bio,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userName,
      role: role,
      location: location,
      bio: bio,
    },
  });
  const fileRef = form.register("pfp");

  const { username: usernameDep, role: roleDep, location: locationDep, bio: bioDep } = form.watch();

  useEffect(() => {
    const fields = ["username", "role", "location", "bio"] as const;

    setHasUnsavedChanges(fields.some((field) => form.getValues([field])[0] !== lastSavedProfileData[field]));
  }, [lastSavedProfileData, form, usernameDep, roleDep, locationDep, bioDep]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!hasUnsavedChanges) {
      return;
    }

    const formData = new FormData();
    formData.append("username", values.username);
    if (values.pfp[0]) formData.append("pfp", values.pfp[0]);
    if (values.role != null) formData.append("role", values.role);
    if (values.location != null) formData.append("location", values.location);
    if (values.bio != null) formData.append("bio", values.bio);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { name, role, location, bio } = data;

        form.setValue("username", name);
        form.setValue("role", role);
        form.setValue("location", location);
        form.setValue("bio", bio);

        setLastSavedProfileData({
          username: name,
          role: role,
          location: location,
          bio: bio,
        });

        console.log(data);
        toast({
          title: "Saved Successfully!",
        });
      })
      .catch((e) => console.error(e));
  }

  return (
    <>
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-calcom">Your Devside</h1>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Image src={pfp} width={256} height={256} alt="Profile Picture" priority={true} />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jeff Bezos" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pfp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Input type="file" placeholder="shadcn" {...fileRef} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Potato Peeler" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Based In</FormLabel>
                        <FormControl>
                          <Input placeholder="Canada" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g. What inspires you?" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={!hasUnsavedChanges}>
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </section>
        <section className="flex justify-center mt-16 gap-8">
          <div>
            <h2 className="text-2xl mb-4 font-calcom">Links</h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input type="text" placeholder="Link..." />
              </div>
              <div className="flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value ? socials.find((social) => social.value === value)?.label : "Select social..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search social..." />
                      <CommandEmpty>No Socials found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {socials.map((social) => (
                            <CommandItem
                              key={social.value}
                              value={social.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", value === social.value ? "opacity-100" : "opacity-0")}
                              />
                              {social.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Button>Add</Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-calcom mb-4">Projects</h2>
            <div className="flex gap-2">
              <div>
                <Input type="text" placeholder="L" className="w-10" />
              </div>
              <div className="flex-1">
                <Input type="text" placeholder="Name..." />
              </div>
              <div className="flex-1">
                <Input type="text" placeholder="Link..." />
              </div>
            </div>
            <div>
              <Textarea placeholder="Description..." />
            </div>
            <div>
              <FancyMultiSelect />
            </div>
            <div>
              <Button>Add</Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
