import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@component-library/ui";
import { getDoc, getDocSlugs, getPager } from "@/lib/docs";

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
  const { prev, next } = await getPager(`/docs/${slug.join("/")}`.replace(/\/$/, ""));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">{metadata.title}</h1>
      {metadata.description && (
        <p className="mt-2 text-lg text-muted-foreground">{metadata.description}</p>
      )}
      <Content />
      <div className="mt-16 flex items-center justify-between border-t pt-6">
        {prev ? (
          <Button variant="outline" asChild>
            <Link href={prev.href}>
              <ArrowLeftIcon data-icon="inline-start" />
              {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="outline" asChild>
            <Link href={next.href}>
              {next.title}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
