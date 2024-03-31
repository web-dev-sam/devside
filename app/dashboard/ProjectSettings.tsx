"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FancyMultiSelect } from "./MultiSelect";
import { Textarea } from "@/components/ui/textarea";

export function ProjectSettings() {
  return (
    <>
      <section className="flex flex-col max-w-md mx-auto justify-center mt-16 gap-8">
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
            <Button variant="outline">Add</Button>
          </div>
        </div>
      </section>
    </>
  );
}
