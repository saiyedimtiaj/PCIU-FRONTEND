import { resolveUploadUrl } from "@/lib/upload-url";
import { getPublishedAt } from "@/lib/news-date";
import type { ApiResponse, NewsArticle } from "@/types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function extractArticles(payload: unknown): NewsArticle[] {
  if (Array.isArray(payload)) return payload as NewsArticle[];
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as ApiResponse<unknown>).data;
  if (Array.isArray(data)) return data as NewsArticle[];
  if (data && typeof data === "object") {
    const arrays = Object.values(data).filter(Array.isArray);
    if (arrays.length === 1) return arrays[0] as NewsArticle[];
  }
  return [];
}

function normalizeArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    coverImageUrl: resolveUploadUrl(article.coverImageUrl ?? article.imageUrl),
    multipleImage: (article.multipleImage ?? []).map((image) =>
      resolveUploadUrl(image),
    ),
  };
}

export async function getNewsArticles(): Promise<{
  articles: NewsArticle[];
  error: boolean;
}> {
  if (!API_BASE_URL) return { articles: [], error: true };
  try {
    const response = await fetch(`${API_BASE_URL}/home/news-articles`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return { articles: [], error: true };
    const payload = await response.json();
    const articles = extractArticles(payload)
      .filter(
        (article) =>
          article.status === true &&
          (article.deletedAt === null || article.deletedAt === undefined),
      )
      .sort(
        (a, b) =>
          new Date(getPublishedAt(b)).getTime() -
          new Date(getPublishedAt(a)).getTime(),
      )
      .map(normalizeArticle);
    return { articles, error: false };
  } catch {
    return { articles: [], error: true };
  }
}

export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticle | null> {
  const { articles } = await getNewsArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
