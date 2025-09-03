"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

const frameworks = [
  {
    value: "general",
    label: "General",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function DateSpecialtyPicker() {
  const [openSpecialty, setOpenSpecialty] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Popover open={openSpecialty} onOpenChange={setOpenSpecialty}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSpecialty}
              className="justify-between font-normal mx-4 my-2"
            >
              {value
                ? frameworks.find((framework) => framework.value === value)
                    ?.label
                : "Elige especialidad"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-1  ">
            <Command>
              <CommandInput
                placeholder="Buscar especialidad..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No especilidad encontrada.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpenSpecialty(false);
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1"></Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="justify-between font-normal mx-4 me-4"
            >
              {date ? date.toLocaleDateString() : "Elige fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
