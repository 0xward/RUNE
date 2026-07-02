import type { SourceConnector } from "./types";

export const connectorRegistry: SourceConnector[] = [
  {
    id: "hackernews",
    label: "Hacker News",
    kind: "social",
    enabled: true,
    collect: async () => [],
  },
  {
    id: "arxiv",
    label: "arXiv Research Papers",
    kind: "paper",
    enabled: true,
    collect: async () => [],
  },
  {
    id: "github",
    label: "GitHub Trending",
    kind: "repository",
    enabled: true,
    collect: async () => [],
  },
];
