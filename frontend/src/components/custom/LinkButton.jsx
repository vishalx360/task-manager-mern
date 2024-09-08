import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

function LinkButton({ children, href, variant }) {
  const overrides = {
    default: "bg-white text-blue-500 hover:bg-blue-100 ml-5",
    secondary: "bg-blue-500 text-white hover:bg-blue-700 ml-5",
  };
  const override = overrides[variant] || "";
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: variant || "default" }),
        override
      )}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
