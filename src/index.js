import { escape } from "html-escaper";

export default {
    async fetch(request, env, ctx) {
        const motd = await env.KV.get("MOTD") ?? await this.updateMOTD(env);

        return new Response(this.buildSVG(motd), {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        });
    },

    async scheduled(controller, env, ctx) {
        await this.updateMOTD(env);
    },

    async updateMOTD(env) {
        const res = await env.AI.run("@cf/meta/llama-3.2-1b-instruct", {
            messages: [
                {
                    role: "system",
                    content: "You are a witty programmer. Output ONLY a short one-sentence (max 70 characters) MOTD. No commentary."
                },
                {
                    role: "user",
                    content: "Generate a funny programmer MOTD"
                }
            ],
            max_tokens: 20,
            temperature: 0.7
        });

        await env.KV.put("MOTD", res.response);

        return res.response;
    },

    buildSVG(text) {
        return `
            <svg width="500" height="70" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="0" y="0" width="100%" height="50">
                    <div xmlns="http://www.w3.org/1999/xhtml"
                        style="font-family: monospace; font-size: 12px; color: #02c39a; text-align: left;">
                        ${escape(text)}
                    </div>
                </foreignObject>

                <text x="0" y="50" font-family="monospace" font-size="9" fill="#078b6e">
                    🤖 Auto-generated daily quote
                </text>
            </svg>
        `;
    }
};
