/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FancyMultiSelect } from "./MultiSelect";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, ChevronUp, ExternalLink, Trash } from "lucide-react";

const FRAMEWORKS: Technology[] = [
  {
    link: "https://nextjs.org",
    name: "Next.js",
    logo: "/nextjs.svg",
  },
  {
    link: "https://svelte.dev",
    name: "SvelteKit",
    logo: "/svetle.svg",
  },
  {
    link: "https://nuxt.com/",
    name: "Nuxt.js",
    logo: "/nuxt.svg",
  },
  {
    link: "https://remix.run/",
    name: "Remix",
    logo: "/remix.svg",
  },
  {
    link: "https://astro.build/",
    name: "Astro",
    logo: "/astro.svg",
  },
  {
    link: "https://wordpress.com/",
    name: "WordPress",
    logo: "/wordpress.svg",
  },
  {
    link: "https://expressjs.com/",
    name: "Express.js",
    logo: "/express.svg",
  },
  {
    link: "https://nestjs.com/",
    name: "Nest.js",
    logo: "/nestjs.svg",
  },
];

export type Technology = {
  _id?: any;
  name: string;
  logo: string;
  link: string;
};

export type Project = {
  _id?: any;
  id: string;
  name: string;
  link: string;
  description: string;
  stack: Technology[];
  logo?: string | File;
};

export type ProjectSettingsData = {
  _id?: any;
  projects: Project[];
};

export function ProjectSettings({
  serverProjects,
  onChange,
}: {
  serverProjects: Project[];
  onChange: (opts: ProjectSettingsData) => void;
}) {
  const [projects, setProjects] = useState<Project[]>(serverProjects);
  const [enteredProjectName, setEnteredProjectName] = useState("");
  const [enteredProjectLink, setEnteredProjectLink] = useState("");
  const [enteredProjectDescription, setEnteredProjectDescription] = useState("");
  const [enteredProjectStack, setEnteredProjectStack] = useState<Technology[]>([]);
  const [enteredProjectLogo, setEnteredProjectLogo] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (hasUnsavedChanges) {
      onChange({ projects });
    }
  }, [projects]);

  return (
    <>
      <section className="flex flex-col lg:flex-row w-full md:w-full lg:w-2/3 max-w-[1200px] mx-auto justify-center mt-16 gap-8">
        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <div className="hidden">
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setEnteredProjectLogo(file);
                }}
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Name.."
                onInput={(e) => setEnteredProjectName(((e.target || e.currentTarget) as any).value.trim())}
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Link.."
                onInput={(e) => setEnteredProjectLink(((e.target || e.currentTarget) as any).value.trim())}
              />
            </div>
          </div>
          <div>
            <Textarea
              placeholder="Description.."
              onInput={(e) => setEnteredProjectDescription(((e.target || e.currentTarget) as any).value.trim())}
            />
          </div>
          <div>
            <FancyMultiSelect
              frameworks={FRAMEWORKS}
              onChoose={(techs) => {
                setEnteredProjectStack(techs);
              }}
              defaultValues={[]}
            />
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                if (!enteredProjectName.trim()) {
                  toast.toast({
                    title: "Error",
                    description: "Please enter a project name.",
                    variant: "destructive",
                  });
                  return;
                }

                if (enteredProjectLink && !/https?:\/\/.+\..+/.test(enteredProjectLink)) {
                  toast.toast({
                    title: "Error",
                    description: "Please enter a valid URL.",
                    variant: "destructive",
                  });
                  return;
                }

                setProjects((prev) => [
                  ...prev,
                  {
                    id: Math.random().toString(36),
                    name: enteredProjectName.trim(),
                    link: enteredProjectLink,
                    description: enteredProjectDescription,
                    stack: enteredProjectStack,
                    logo: enteredProjectLogo,
                  },
                ]);
                setHasUnsavedChanges(true);
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="bg-gray-100 lg:w-[1px] h-[1px] lg:h-auto"></div>
        <div className="flex-1 text-left space-y-16">
          {projects.length > 0 &&
            projects.map((project, index) => (
              <div key={project.id} className="flex gap-8 items-center">
                <div className="flex justify-between flex-col text-gray-400 text-center self-stretch">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setProjects(() => {
                        const newProjects = [...projects];
                        const temp = newProjects[index];
                        newProjects[index] = newProjects[index - 1];
                        newProjects[index - 1] = temp;
                        return newProjects;
                      });
                      setHasUnsavedChanges(true);
                    }}
                    disabled={index === 0}
                  >
                    <ChevronUp size={16} />
                  </Button>
                  {index + 1}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setProjects(() => {
                        const newProjects = [...projects];
                        const temp = newProjects[index];
                        newProjects[index] = newProjects[index + 1];
                        newProjects[index + 1] = temp;
                        return newProjects;
                      });
                      setHasUnsavedChanges(true);
                    }}
                    disabled={index === projects.length - 1}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </div>
                <div className="flex-1 space-y-2 rounded-lg">
                  <div className="flex">
                    {project.logo && (
                      <Image
                        src={typeof project.logo === "string" ? project.logo : URL.createObjectURL(project.logo)}
                        alt={project.name}
                        width={64}
                        height={64}
                      />
                    )}
                    <Input
                      className="text-lg font-semibold"
                      defaultValue={project.name}
                      placeholder="Title.."
                      onInput={(e) => {
                        setProjects((prev) => {
                          const newProjects = [...prev];
                          newProjects[index].name = ((e.target || e.currentTarget) as any).value.trim();
                          return newProjects;
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      defaultValue={project.link}
                      placeholder="Link.."
                      onInput={(e) => {
                        setProjects((prev) => {
                          const newProjects = [...prev];
                          newProjects[index].link = ((e.target || e.currentTarget) as any).value.trim();
                          return newProjects;
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                    <Button variant="secondary" onClick={() => window.open(project.link)}>
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                  <div className="flex">
                    <FancyMultiSelect
                      frameworks={FRAMEWORKS}
                      onChoose={(techs) => {
                        setProjects((prev) => {
                          const newProjects = [...prev];
                          newProjects[index].stack = techs;
                          return newProjects;
                        });
                        setHasUnsavedChanges(true);
                      }}
                      defaultValues={project.stack}
                    />
                  </div>
                  <p>
                    <Textarea
                      defaultValue={project.description}
                      placeholder="Description.."
                      onInput={(e) => {
                        setProjects((prev) => {
                          const newProjects = [...prev];
                          newProjects[index].description = ((e.target || e.currentTarget) as any).value.trim();
                          return newProjects;
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setProjects(projects.filter((_, i) => i !== index));
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
