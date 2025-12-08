"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      size="sm"
      className="ml-4"
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Volver
    </Button>
  );
}
