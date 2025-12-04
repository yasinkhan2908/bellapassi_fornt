"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BootstrapCleanup() {
  const pathname = usePathname();

  const removeBootstrapStuff = () => {
    // Remove Bootstrap modal class
    document.body.classList.remove("modal-open");

    // Remove inline styles that block scroll
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Remove all modal backdrops
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((b) => b.remove());
  };

  // Run cleanup when route changes
  useEffect(() => {
    removeBootstrapStuff();
  }, [pathname]);

  // Also run cleanup on unmount
  useEffect(() => {
    return () => removeBootstrapStuff();
  }, []);

  return null;
}
