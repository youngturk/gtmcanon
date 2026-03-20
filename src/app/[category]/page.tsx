import { notFound } from "next/navigation";
import { getCategories } from "@/lib/registry";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          &larr; All categories
        </a>
        <h1 className="text-3xl font-bold mt-3">{category.name}</h1>
        <p className="text-[var(--muted)] mt-2">{category.description}</p>
      </div>

      <div className="space-y-6">
        {category.user_stories.map((story) => (
          <div
            key={story.id}
            className="p-6 rounded-lg border border-[var(--card-border)] bg-[var(--card)] space-y-4"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {story.description}
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1 font-mono">
                {story.id}
              </p>
            </div>

            {/* Recommendation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)] text-white">
                  Recommended
                </span>
                <h3 className="font-semibold">{story.recommendation.tool}</h3>
                <span className="text-xs text-[var(--muted)]">
                  by {story.recommendation.provider}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)]">
                {story.recommendation.why}
              </p>
              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                <div className="p-2 rounded bg-[var(--background)]">
                  <span className="text-[var(--muted)]">Auth: </span>
                  {story.recommendation.auth_method}
                </div>
                <div className="p-2 rounded bg-[var(--background)]">
                  <span className="text-[var(--muted)]">Setup: </span>
                  {story.recommendation.setup_complexity}
                </div>
                <div className="p-2 rounded bg-[var(--background)]">
                  <span className="text-[var(--muted)]">Pricing: </span>
                  {story.recommendation.pricing}
                </div>
              </div>

              {/* Example API call */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Example API call</h4>
                <pre className="p-4 rounded bg-[var(--background)] text-xs overflow-x-auto">
                  <span className="text-[var(--accent)]">
                    {story.recommendation.example.method}
                  </span>{" "}
                  {story.recommendation.example.url}
                  {"\n\n"}
                  {story.recommendation.example.body
                    ? JSON.stringify(story.recommendation.example.body, null, 2)
                    : ""}
                  {"\n\n// Response:\n"}
                  {JSON.stringify(
                    story.recommendation.example.response,
                    null,
                    2
                  )}
                </pre>
              </div>

              <a
                href={story.recommendation.api_docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm text-[var(--accent)] hover:underline"
              >
                View full docs &rarr;
              </a>
            </div>

            {/* Alternatives */}
            {story.alternatives.length > 0 && (
              <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
                <h4 className="text-sm font-medium text-[var(--muted)]">
                  Alternatives
                </h4>
                {story.alternatives.map((alt) => (
                  <div key={alt.tool} className="flex items-start gap-3">
                    <div>
                      <span className="font-medium text-sm">{alt.tool}</span>
                      <span className="text-xs text-[var(--muted)] ml-2">
                        by {alt.provider}
                      </span>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {alt.why}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
