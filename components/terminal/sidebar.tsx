import { Circle } from "lucide-react";
import { navItems, providers } from "@/lib/intelligence/mock-data";

export function LeftSidebar({ active }: { active: string }) {
  return (
    <aside className="border-r border-rune-border p-5 lg:p-6">
      <div className="mb-10">
        <div className="text-2xl font-bold tracking-[0.32em]">RUNE</div>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-rune-muted">Signal Over Noise</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item}
            href={item === "Overview" ? "/overview" : `/${item.toLowerCase()}`}
            className={`flex items-center justify-between border px-3 py-2 text-sm transition ${item === active ? "border-rune-border bg-rune-panel text-white" : "border-transparent text-rune-muted hover:border-rune-border hover:text-white"}`}
          >
            <span>{item}</span>
            {item === active ? <Circle className="h-2 w-2 fill-white" /> : null}
          </a>
        ))}
      </nav>
      <div className="mt-12 border-t border-rune-border pt-6">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-rune-muted">Connected Models</p>
        {providers.map((provider) => (
          <div key={provider.id} className="flex items-center justify-between py-2 text-sm">
            <span>{provider.label}</span>
            <span className="flex items-center gap-2 text-xs text-rune-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${provider.status === "connected" ? "bg-white" : "bg-zinc-600"}`} />
              {provider.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
