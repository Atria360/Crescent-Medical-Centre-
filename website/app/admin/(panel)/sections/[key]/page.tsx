import { notFound } from "next/navigation";
import { getBlockSchema } from "@/lib/cms-schemas";
import BlockEditor from "@/components/admin/BlockEditor";

export const dynamic = "force-dynamic";

export default async function SectionEditPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const schema = getBlockSchema(key);
  if (!schema) notFound();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-teal">{schema.group} section</p>
      <h1 className="mt-1 text-2xl">{schema.label}</h1>
      <div className="mt-8">
        <BlockEditor schema={schema} />
      </div>
    </div>
  );
}
