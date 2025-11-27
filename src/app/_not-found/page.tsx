// app/not-found.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const metadata = {
  title: '404 - Not Found',
  description: 'The page you are looking for does not exist.',
}

export default async function NotFound() {
  const session = await getServerSession(authOptions);
  console.log("session : ",session?.user.token);
  const token = session?.user.token;
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  )
}