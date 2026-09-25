import type { NewsArticle } from "@/types/home";

export function getPublishedAt(article: NewsArticle): string {
  return article.publishedAt ?? article.createdAt;
}

export function formatPublishedDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}
