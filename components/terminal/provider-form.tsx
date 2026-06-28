import { connectProviderAction } from "@/app/actions";
import { providers } from "@/lib/intelligence/mock-data";

export function ProviderConnectForm() {
  return (
    <form action={connectProviderAction} className="border border-rune-border bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-rune-muted">Encrypted BYOK</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_160px]">
        <select name="provider" className="border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white">
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.label}</option>)}
        </select>
        <input name="apiKey" type="password" placeholder="Paste API key" className="border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white placeholder:text-rune-muted" />
        <button className="border border-white px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black">Seal key</button>
      </div>
      <p className="mt-3 text-xs leading-5 text-rune-muted">Keys are sealed through the server action path and should be persisted only as encrypted material plus a display-safe hint.</p>
    </form>
  );
}
