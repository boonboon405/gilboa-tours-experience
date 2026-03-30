import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.25.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(20),
  message: z.string().trim().min(1).max(2000),
});

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response('Too many requests', { status: 429, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message || "Validation error";
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params = new URLSearchParams({
      name: esc(parsed.data.name),
      email: esc(parsed.data.email),
      phone: esc(parsed.data.phone),
      message: esc(parsed.data.message),
      source: "website",
      timestamp: new Date().toISOString(),
    });

    const webhookUrl = `https://wde.app.n8n.cloud/webhook/805437d0-da8b-4ec5-9a10-154900493358?${params.toString()}`;

    const resp = await fetch(webhookUrl, {
      method: "GET",
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("[forward-webhook] Non-OK response:", resp.status, text?.slice(0, 300));
      return new Response(
        JSON.stringify({ error: "Webhook request failed", status: resp.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[forward-webhook] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
