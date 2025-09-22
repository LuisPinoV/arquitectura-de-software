"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import { motion } from "framer-motion";

const buttonsStyle: React.CSSProperties = {
    display: "flex",
    flex:"1 1"
  };

export function GoBackButton() {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button variant={"outline"} style={buttonsStyle} asChild>
        <Link href="/dashboard/account-settings">
          <Undo2 className="text-secondary-foreground" />
          <span className="text-secondary-foreground">Volver</span>
        </Link>
      </Button>
    </motion.div>
  );
}
