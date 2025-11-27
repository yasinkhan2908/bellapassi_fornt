import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DynamicSession() {
  const session = await getServerSession(authOptions); // dynamic code is now safe
  console.log("Session:", session);
  return null;
}
