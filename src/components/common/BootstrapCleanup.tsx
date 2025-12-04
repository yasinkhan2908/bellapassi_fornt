"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BootstrapCleanup() {
  const pathname = usePathname();

  const removeBootstrapStuff = () => {
    document.body.classList.remove("modal-open");

    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((b) => b.remove());
  };

  // Cleanup when route changes
  useEffect(() => {
    removeBootstrapStuff();
  }, [pathname]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => removeBootstrapStuff();
  }, []);

  return null;
}
