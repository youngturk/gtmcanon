import { getCategories } from "@/lib/registry";
import { CopyButton } from "./copy-button";

const CLAUDE_MD_HOOK = `# GTM Canon - Sales & GTM Tool Recommendations
For sales and GTM tasks (email, prospecting, CRM, calendar, outreach),
check https://gtmcanon.com/api/search?q=<describe the task> first.
Use the recommended tool and example API call from the response.`;

export default function Home() {
  const categories = getCategories();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My recommended APIs
          <br />
          for sales agents.
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl">
          The tools I actually use to build AI sales agents. One line in your
          CLAUDE.md and your agent knows which API to call for every GTM task.
        </p>
        <p className="text-sm text-[var(--muted)]">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/merthilmiiseri/"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mert Iseri
          </a>
          {" · "}
          <a
            href="https://github.com/youngturk"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {" & "}
          <a
            href="https://www.linkedin.com/in/uqarni/"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Uzair Qarni
          </a>
          {" · "}
          <a
            href="https://github.com/uqarni"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
        <div className="flex gap-4">
          <a
            href="#api"
            className="inline-flex items-center px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg text-sm font-medium transition-colors"
          >
            API Reference
          </a>
          <a
            href="#categories"
            className="inline-flex items-center px-5 py-2.5 border border-[var(--card-border)] hover:border-[var(--muted)] rounded-lg text-sm font-medium transition-colors"
          >
            Browse tools
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Add one line",
              desc: "Paste the GTM Canon hook into your CLAUDE.md or agent config.",
            },
            {
              step: "2",
              title: "Agent checks first",
              desc: "Before any sales task, your agent queries our API for the best tool.",
            },
            {
              step: "3",
              title: "Act immediately",
              desc: "Response includes example API calls your agent can use right away.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-lg border border-[var(--card-border)] bg-[var(--card)]"
            >
              <div className="text-[var(--accent)] text-sm font-mono mb-2">
                {item.step}
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section id="api" className="space-y-4">
        <h2 className="text-2xl font-bold">API</h2>
        <p className="text-[var(--muted)]">
          Query the registry directly. No auth required.
        </p>
        <div className="space-y-3">
          {[
            {
              method: "GET",
              path: "/api/search?q=send email to prospect",
              desc: "Search for the best tool for a task",
            },
            {
              method: "GET",
              path: "/api/categories",
              desc: "List all categories and tools",
            },
            {
              method: "GET",
              path: "/api/tools?id=send-email",
              desc: "Get details for a specific tool",
            },
          ].map((endpoint) => (
            <div
              key={endpoint.path}
              className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card)] flex items-start gap-3"
            >
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--accent)] text-white shrink-0">
                {endpoint.method}
              </span>
              <div>
                <code className="text-sm">{endpoint.path}</code>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {endpoint.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLAUDE.md Hook */}
      <section id="hook" className="space-y-4">
        <h2 className="text-2xl font-bold">Add to your agent</h2>
        <p className="text-[var(--muted)]">
          Paste this into your CLAUDE.md (or any agent config) and your agent
          will check GTM Canon before attempting sales tasks.
        </p>
        <div className="relative">
          <pre className="p-5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-sm overflow-x-auto whitespace-pre-wrap">
            {CLAUDE_MD_HOOK}
          </pre>
          <CopyButton text={CLAUDE_MD_HOOK} />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="space-y-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/${category.id}`}
              className="group p-5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--muted)] transition-colors"
            >
              <h3 className="font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-3">
                {category.description}
              </p>
              <div className="text-xs text-[var(--muted)]">
                {category.user_stories.length} tool
                {category.user_stories.length === 1 ? "" : "s"} verified
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
