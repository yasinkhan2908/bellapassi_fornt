"use client";

import Cookies from "js-cookie";
import { nanoid } from "nanoid";

export function getSessionId(): string {
  let id = Cookies.get("guest_session");

  if (!id) {
    id = nanoid(32);
    Cookies.set("guest_session", id, { expires: 365 });
  }

  return id;
}
