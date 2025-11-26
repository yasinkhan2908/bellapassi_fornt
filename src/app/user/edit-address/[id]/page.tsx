import EditAddress from "../[id]/EditAddress";
import { notFound } from "next/navigation";

interface EditAddressPageProps {
  params: Promise<{ id: string }>;
}


export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  if (!id) return notFound();

  // ✅ pass the ID
  return <EditAddress id={id} />;
}
