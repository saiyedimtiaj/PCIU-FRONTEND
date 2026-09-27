import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getNewsArticleBySlug } from "@/lib/api/news";
import { formatPublishedDate, getPublishedAt } from "@/lib/news-date";
import NewsCarousel from "../_ui/NewsCarousel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await getNewsArticleBySlug((await params).slug);
  return article
    ? {
        title: `${article.title} | PCIU News`,
        description: article.excerpt ?? article.title,
      }
    : {};
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await getNewsArticleBySlug((await params).slug);
  if (!article) notFound();

  const images = [
    article.coverImageUrl,
    ...(article.multipleImage ?? []),
  ].filter(
    (image, index, all): image is string =>
      Boolean(image) && all.indexOf(image) === index,
  );

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb
        items={[{ label: "News", href: "/news" }, { label: article.title }]}
      />
      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <article className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm">
          {images.length > 0 && (
            <NewsCarousel images={images} title={article.title} />
          )}
          <div className="p-5 sm:p-8 lg:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
              {article.category ?? "News"}
            </p>
            <h1 className="font-heading text-2xl font-bold leading-tight text-primary sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Published: {formatPublishedDate(getPublishedAt(article))}
              {article.author && ` · By ${article.author}`}
            </p>
            {article.body ? (
              <div
                className="prose prose-slate mt-8 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            ) : (
              article.excerpt && (
                <p className="mt-8 text-base leading-8 text-muted-foreground">
                  {article.excerpt}
                </p>
              )
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
