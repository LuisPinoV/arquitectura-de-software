"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SettingButtonProps = {
  Icon: React.ReactNode;
  title: string;
  url: string;
};

export default function SettingButton({ Icon, title, url }: SettingButtonProps) {
  const buttonsStyle: React.CSSProperties = {
    display: "flex",
    padding: "50% 48%",
    minWidth: "200px",
    flexDirection: "column",
    height:"12vw",
    width:"12vw"
  };

  return (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
      <Button
        className="text-xl font-semibold"
        variant={"outline"}
        style={buttonsStyle}
        asChild
      >
        <Link href={url}>
          {Icon}
          <span className="text-secondary-foreground">{title}</span>
        </Link>
      </Button>
    </motion.div>
  );
}
