"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  cn,
  extractBehanceUsername,
  extractDribbbleUsername,
  extractGithubUsername,
  extractLinkedInUsername,
  extractTwitterUsername,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Trash } from "lucide-react";

export const PLATFORMS = ["twitter", "github", "linkedin", "dribbble", "behance"] as const;
export type Platform = (typeof PLATFORMS)[number];
export type SocialLink = {
  platform: Platform;
  username: string;
};

const platforms: Platform[] = ["twitter", "github", "linkedin", "dribbble", "behance"];
const getPlatformLabel = (platform: Platform, def = "Unknown") => {
  return (
    {
      twitter: "Twitter",
      github: "GitHub",
      linkedin: "LinkedIn",
      dribbble: "Dribbble",
      behance: "Behance",
    }[platform] ?? def
  );
};

export type SocialSettingsData = {
  links: SocialLink[];
};

export function LinkSettings({
  serverLinks,
  onChange,
}: {
  serverLinks: SocialLink[];
  onChange: (opts: SocialSettingsData) => void;
}) {
  const [links, setLinks] = useState(serverLinks);
  const [nonSelectedPlatforms, setNonSelectedPlatforms] = useState(
    platforms.filter((platform) => !links.some((link) => link.platform === platform)),
  );
  const [enteredSocialLink, setEnteredSocialLink] = useState("");
  const [enteredPlatform, setEnteredPlatform] = useState<Platform | null>("github");
  const [openSocialDropdown, setOpenSocialDropdown] = useState(false);
  const [attemptedToAdd, setAttemptedToAdd] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (hasUnsavedChanges) {
      onChange({
        links,
      });
    }
  }, [links]); // eslint-disable-line react-hooks/exhaustive-deps

  const urlToUsername = (platform: Platform, url: string) => {
    return (
      {
        twitter: () => extractTwitterUsername(url),
        github: () => extractGithubUsername(url),
        linkedin: () => extractLinkedInUsername(url),
        dribbble: () => extractDribbbleUsername(url),
        behance: () => extractBehanceUsername(url),
      }[platform]?.() ?? null
    );
  };

  function checkLinkValidity(
    platform: Platform,
    url: string,
  ): {
    valid: boolean;
    username: string | null;
  } {
    const isLink = /^https?:\/\/[^\s]+$/.test(url);
    const hasLinkChar = /[/]/.test(url);
    if (hasLinkChar) {
      if (!isLink) {
        return {
          valid: false,
          username: null,
        };
      }

      const username = urlToUsername(platform, url);
      return {
        valid: username !== "",
        username,
      };
    } else {
      return {
        valid: true,
        username: url,
      };
    }
  }

  return (
    <>
      <section className="max-w-xl mx-auto space-y-8">
        <div>
          {links.length > 0 && (
            <ul className="text-left mb-2">
              {links.map((social) => (
                <li key={social.platform} className="flex items-center py-1 cursor-move">
                  <div className="py-2 px-3 flex flex-1">
                    <div className="flex flex-1 gap-2">
                      <div>
                        <Button variant="outline" className="w-[100px] bg-transparent border-none" disabled>
                          {getPlatformLabel(social.platform, "Select..")}
                        </Button>
                      </div>
                      <Input
                        className="flex-1"
                        defaultValue={social.username}
                        onInput={(e) => {
                          const newInput = e.currentTarget.value;
                          const currentLink = links.find((l) => l.platform === social.platform);
                          if (!currentLink) {
                            return;
                          }

                          const isValidLink = checkLinkValidity(currentLink.platform, e.currentTarget.value);
                          if (!isValidLink.valid) {
                            return;
                          }

                          const newLinks = links.map((l) =>
                            l.platform === social.platform ? { ...l, username: isValidLink.username } : l,
                          );
                          setHasUnsavedChanges(true);
                          setLinks(newLinks);
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setHasUnsavedChanges(true);
                          setLinks(links.filter((l) => l.platform !== social.platform));
                          setNonSelectedPlatforms([...nonSelectedPlatforms, social.platform]);
                        }}
                        className="ml-3"
                      >
                        <Trash className="h-4 w-4 shrink-0" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {nonSelectedPlatforms.length > 0 && (
            <div className="flex gap-2">
              <div>
                <Popover open={openSocialDropdown} onOpenChange={setOpenSocialDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={!enteredPlatform && attemptedToAdd ? "destructive" : "outline"}
                      role="combobox"
                      aria-expanded={openSocialDropdown}
                      className="w-[120px] justify-between"
                    >
                      {getPlatformLabel(enteredPlatform, "Select..")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Social..." />
                      <CommandEmpty>No Socials found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {nonSelectedPlatforms.map((platform) => (
                            <CommandItem
                              key={platform}
                              value={platform}
                              onSelect={(currentValue) => {
                                setEnteredPlatform(currentValue as Platform);
                                setOpenSocialDropdown(false);
                                setAttemptedToAdd(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  platform === enteredPlatform ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {getPlatformLabel(platform, "Unknown")}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Link..."
                  className={cn(!enteredSocialLink && attemptedToAdd ? "border-red-500" : "")}
                  onInput={(e) => {
                    setEnteredSocialLink(e.currentTarget.value);
                    setAttemptedToAdd(false);
                  }}
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAttemptedToAdd(true);
                    if (!enteredPlatform || !enteredSocialLink) {
                      return;
                    }

                    const isValidLink = checkLinkValidity(enteredPlatform, enteredSocialLink);
                    if (!isValidLink.valid) {
                      setEnteredSocialLink("");
                      return;
                    }

                    setAttemptedToAdd(false);
                    setHasUnsavedChanges(true);
                    setLinks([...links, { platform: enteredPlatform, username: isValidLink.username }]);
                    setNonSelectedPlatforms(nonSelectedPlatforms.filter((p) => p !== enteredPlatform));
                    setEnteredPlatform(null);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
