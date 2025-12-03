"use client";

import { useEffect } from "react";

export default function useSelect2(selector = ".select2") {
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function load() {
      // Load jQuery
      const $ = (await import("jquery")).default;
      window.$ = window.jQuery = $;

      // Load Select2 FULL build
      await import("select2/dist/js/select2.full.js");

      // Initialization
      $(function () {
        $(selector).select2();
      });
    }

    load();
  }, [selector]);
}
