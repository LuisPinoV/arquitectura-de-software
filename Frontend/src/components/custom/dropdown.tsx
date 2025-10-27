"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckedState } from "@radix-ui/react-checkbox";

type DropdownSingleSelectedProps = {
  data: {
    name: string;
    categories: string[];
    default: string;
  };
  value: string;
  onChange: (changedLabel: string) => void;
};

type DropdownMultipleSelectedProps = {
  data: {
    name: string;
    desc: string;
    categories: string[];
    defaultAllSelected: boolean;
  };
  value: CheckedState[];
  onChange: (selected: string) => void;
};

export function DropdownMenuCheckboxes({
  data: settings,
  value,
  onChange,
}: DropdownMultipleSelectedProps) {

  const handleChange = (label: string) => {
    onChange(label);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex-grow-1 flex-shrink-1 flex-basis-100 font-light"
        >
          <p className="m-0 text-left flex-grow-1 flex-shrink-1 flex-basis-100">
            {settings.name}
          </p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-filters">
        <DropdownMenuLabel>{settings.desc}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {settings.categories.map((label: any, i) => (
          <DropdownMenuCheckboxItem
            key={label}
            checked={value[i]}
            onCheckedChange={() => handleChange(label)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DropdownOneSelected({
  data: settings,
  value,
  onChange,
}: DropdownSingleSelectedProps) {
  const handleChange = (key: string) => {
    onChange(key);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-grow-1 font-light">
          <p className="m-0 text-left flex-grow-1">{value}</p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {settings.categories.map((label: string) => (
          <DropdownMenuCheckboxItem
            key={label}
            checked={value === label}
            onCheckedChange={() => handleChange(label)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
