"use client";

import { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, LogOut, PanelTop, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = ({ pfp, path }: { pfp: string; path: string }) => {
  const router = useRouter();
  const toast = useToast();

  return (
    <header className="flex px-8 py-6">
      <div className="flex-1"></div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={pfp}
              alt={`Profile Picture`}
              className="w-12 rounded-full cursor-pointer"
              priority={true}
              width={48}
              height={48}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  path
                    ? router.push(`/${path.replaceAll(/[^a-z0-9-]/g, "")}`)
                    : toast.toast({
                        title: "Error",
                        description: "Please set your URL name first. You can do this in the settings.",
                        variant: "destructive",
                      })
                }
              >
                <PanelTop className="mr-2 h-4 w-4" />
                <span>My Page</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
