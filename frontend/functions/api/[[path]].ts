// Proxies /api/* to the FastAPI backend so the browser stays same-origin.
interface Env {
  BACKEND_URL: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.BACKEND_URL) {
    return new Response(JSON.stringify({ detail: "BACKEND_URL is not configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }
  const url = new URL(request.url);
  const target = env.BACKEND_URL.replace(/\/$/, "") + url.pathname + url.search;
  return fetch(new Request(target, request));
};
