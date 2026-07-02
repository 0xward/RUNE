"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { connectProviderAction } from "@/app/actions";
import { PROVIDER_CONFIGS } from "@/lib/intelligence/providers";

type ActionState = Awaited<ReturnType<typeof connectProviderAction>> | null;

export function ProviderConnectForm() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = await connectProviderAction(formData);
      if (result.ok) {
        router.refresh();
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="border border-rune-border bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-rune-muted">Encrypted BYOK</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_160px]">
        <select name="provider" className="border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white">
          {Object.values(PROVIDER_CONFIGS).map((provider) => (
            <option key={provider.id} value={provider.id}>{provider.label}</option>
          ))}
        </select>
        <input name="apiKey" type="password" placeholder="Paste API key" className="border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white placeholder:text-rune-muted" />
        <button disabled={pending} className="border border-white px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black disabled:opacity-50">
          {pending ? "Sealing…" : "Seal key"}
        </button>
      </div>
      {state && (
        <p className={`mt-3 text-xs leading-5 ${state.ok ? "text-green-400" : "text-red-400"}`}>
          {state.ok ? `✓ Sealed and saved — hint: ${state.keyHint}` : state.message}
        </p>
      )}
      {!state && (
        <p className="mt-3 text-xs leading-5 text-rune-muted">Keys are encrypted with AES-GCM before being stored. RUNE never sees your raw API key after this step.</p>
      )}
    </form>
  );
}
