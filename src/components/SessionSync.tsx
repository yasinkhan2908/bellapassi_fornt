"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../lib/store";

export default function SessionSync() {
  const state = useSelector((state: RootState) => state);

  useEffect(() => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem("reduxState", JSON.stringify(state));
  }, [state]);

  return null;
}
