import { MessageCircleQuestionMark } from "lucide-react";
import { getFaqs } from "@/lib/api/admission";
import FAQList from "./FAQList";

export default async function FAQ() {
  const result = await getFaqs();

  return (
    <section aria-labelledby="admission-faq-title" className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <MessageCircleQuestionMark aria-hidden="true" className="size-3.5" />
          Help center
        </div>
        <h2
          id="admission-faq-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Common questions and answers about admission at PCIU.
        </p>
      </header>

      {result.status === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8"
        >
          <h3 className="font-semibold text-foreground">
            FAQs are temporarily unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please try again later. We are unable to load the questions right
            now.
          </p>
        </div>
      ) : result.status === "empty" ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10"
        >
          <MessageCircleQuestionMark
            aria-hidden="true"
            className="mx-auto size-9 text-primary/60"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No questions available
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There are no FAQs to display at the moment. Please check back soon.
          </p>
        </div>
      ) : (
        <FAQList faqs={result.data} />
      )}
    </section>
  );
}

export function FAQSkeleton() {
  return (
    <section aria-label="Loading FAQs" aria-busy="true" className="space-y-5">
      <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
      <div className="h-9 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="h-9 w-24 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-18 w-full animate-pulse rounded-2xl bg-muted"
        />
      ))}
    </section>
  );
}
