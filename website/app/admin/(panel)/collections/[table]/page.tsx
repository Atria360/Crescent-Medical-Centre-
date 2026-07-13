import { notFound } from "next/navigation";
import { getCollectionSchema } from "@/lib/cms-schemas";
import CollectionEditor from "@/components/admin/CollectionEditor";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ table: string }>;
}) {
  const { table } = await params;
  const schema = getCollectionSchema(table);
  if (!schema) notFound();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-teal">Collection</p>
      <h1 className="mt-1 text-2xl">{schema.label}</h1>
      <div className="mt-8">
        <CollectionEditor schema={schema} />
      </div>
    </div>
  );
}
