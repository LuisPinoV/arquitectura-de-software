"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar"
import { useState } from "react";

type CustomSearchFormProps = {
  placeholder?: string;
} & React.ComponentProps<"form">;

export function SearchForm({ placeholder = "Buscar...", ...props }: CustomSearchFormProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/busqueda_general/${encodeURIComponent(query)}`);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder= {placeholder}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 pl-7"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
