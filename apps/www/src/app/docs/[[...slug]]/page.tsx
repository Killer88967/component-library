import { notFound } from "next/navigation";
import { getDoc, getDocSlugs } from "@/lib/docs";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getDocSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">) {
  const { slug = [] } = await params;
  const doc = await getDoc(slug);
  return doc ? { title: doc.metadata.title, description: doc.metadata.description } : {};
}

export default async function DocPage({ params }: PageProps<"/docs/[[...slug]]">) {
  const { slug = [] } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();

  const { Content, metadata } = doc;

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{metadata.title}</h1>
      {metadata.description && (
        <p className="text-muted-foreground mt-2 text-lg">{metadata.description}</p>
      )}
      <Content />
    </>
  );
}
