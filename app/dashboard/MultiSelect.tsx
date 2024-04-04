/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Technology } from "./ProjectSettings";

export function FancyMultiSelect({
  frameworks,
  onChoose,
  defaultValues,
}: {
  frameworks: Technology[];
  onChoose: (frameworks: Technology[]) => void;
  defaultValues?: Technology[];
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Technology[]>(defaultValues);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    onChoose(selected);
  }, [selected]);

  const handleUnselect = React.useCallback((framework: Technology) => {
    setSelected((prev) => prev.filter((s) => s.link !== framework.link));
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = frameworks.filter((framework) => !selected.includes(framework));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group bg-secondary text-secondary-foreground px-3 py-2 text-sm rounded-md">
        <div className="flex gap-1 flex-wrap">
          {selected.map((framework) => {
            return (
              <Badge key={framework.link}>
                {framework.name}
                <button
                  className="ml-1 rounded-full outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Your stack.."
            className="bg-transparent outline-none placeholder:text-[#aab0bb] flex-1"
          />
        </div>
      </div>
      <div className="relative">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              <CommandList>
                {selectables.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.link}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, framework]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {framework.name}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
