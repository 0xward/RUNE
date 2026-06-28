import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rune-bg p-6 text-white">
      <div className="max-w-md border border-rune-border bg-rune-panel p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-rune-muted">Signal Lost</p>
        <h1 className="mt-3 text-3xl font-semibold">Route not found</h1>
        <p className="mt-3 text-sm leading-6 text-rune-muted">This terminal surface has not been mapped yet. Return to the overview to continue monitoring reality.</p>
        <Link href="/" className="mt-6 inline-block border border-white px-4 py-2 text-sm transition hover:bg-white hover:text-black">Return to overview</Link>
      </div>
    </main>
  );
}
