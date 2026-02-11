import { escape } from "html-escaper";
import { ExportedHandler, KVNamespace, Ai, ExecutionContext, ScheduledController } from "@cloudflare/workers-types";

interface Env {
    KV: KVNamespace;
    AI: Ai;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const motd = await env.KV.get("MOTD") ?? await this.updateMOTD(env);

        return new Response(this.buildSVG(motd as string), {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        });
    },

    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
        await this.updateMOTD(env);
    },

    async updateMOTD(env: Env) {
        const res = await env.AI.run("@cf/meta/llama-3.2-1b-instruct", {
            messages: [
                {
                    role: "system",
                    content: "You are a witty programmer. Output ONLY a short one-sentence (max 80 characters) MOTD. No commentary."
                },
                {
                    role: "user",
                    content: "Generate a funny programmer MOTD"
                }
            ],
            max_tokens: 30,
            temperature: 0.7
        });

        await env.KV.put("MOTD", res.response as string);

        return res.response;
    },

    buildSVG(text: string) {
        return `
            <svg viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="0" y="0" width="500" height="100">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: monospace;">
                        <div style="font-size: 14px; color: #02c39a;">
                            "${escape(text.replace(/^["]|\."|\.$/g, ""))}"
                        </div>
                        <div style="font-size: 10px; color: #02c39a;">🤖 Auto-generated daily quote</div>
                    </div>
                </foreignObject>
            </svg>
        `;
    }
};
