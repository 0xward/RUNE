import { XMLParser } from "fast-xml-parser";

export interface RawItem {
  title: string;
  url: string;
  source: "HackerNews" | "arXiv" | "GitHub";
  score: number;
  publishedAt: string;
}

// ── HackerNews ──────────────────────────────────────────────────────────────

async function fetchHN(topic: string): Promise<RawItem[]> {
  try {
    const since = Math.floor(Date.now() / 1000) - 86400 * 3;
    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&hitsPerPage=15&numericFilters=created_at_i>=${since}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json() as { hits: Array<{ title: string; url: string; points: number; created_at: string }> };
    return (data.hits ?? []).map((h) => ({
      title: h.title,
      url: h.url ?? "https://news.ycombinator.com",
      source: "HackerNews" as const,
      score: h.points ?? 0,
      publishedAt: h.created_at,
    }));
  } catch { return []; }
}

// ── arXiv ────────────────────────────────────────────────────────────────────

async function fetchArxiv(topic: string): Promise<RawItem[]> {
  try {
    const res = await fetch(
      `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(topic)}&sortBy=submittedDate&sortOrder=descending&max_results=10`,
      { next: { revalidate: 3600 } }
    );
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);
    const entries = parsed?.feed?.entry ?? [];
    const list: Array<Record<string, string>> = Array.isArray(entries) ? entries : [entries];
    return list.map((e) => ({
      title: String(e.title ?? "").replace(/\s+/g, " ").trim(),
      url: String(e.id ?? ""),
      source: "arXiv" as const,
      score: 50,
      publishedAt: String(e.published ?? new Date().toISOString()),
    }));
  } catch { return []; }
}

// ── GitHub Trending ──────────────────────────────────────────────────────────

async function fetchGitHub(topic: string): Promise<RawItem[]> {
  try {
    const query = encodeURIComponent(topic);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "rune-intelligence/1.0",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      }
    );
    const data = await res.json() as { items: Array<{ full_name: string; html_url: string; stargazers_count: number; updated_at: string }> };
    return (data.items ?? []).map((r) => ({
      title: r.full_name,
      url: r.html_url,
      source: "GitHub" as const,
      score: r.stargazers_count,
      publishedAt: r.updated_at,
    }));
  } catch { return []; }
}

// ── Aggregator ───────────────────────────────────────────────────────────────

export async function fetchAllSources(topic: string): Promise<RawItem[]> {
  const [hn, arxiv, gh] = await Promise.all([
    fetchHN(topic),
    fetchArxiv(topic),
    fetchGitHub(topic),
  ]);
  return [...hn, ...arxiv, ...gh].sort((a, b) => b.score - a.score);
}
