import { escape } from "html-escaper";

export default {
    async fetch(request, env, ctx) {
        let motd = await env.KV.get("MOTD") ?? await this.updateMOTD(env);

        const svg = `
            <svg viewBox="0 0 500 50" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">
                <text x="2%" y="50%" font-family="monospace" font-size="10" fill="#02c39a">
                    ${escape(motd)}
                </text>
                <text x="2%" y="85%" font-family="monospace" font-size="8" fill="#078b6e">
                    🤖 AI-generated daily quote
                </text>
            </svg>
        `;

        return new Response(svg, {
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

        return await env.KV.get("MOTD");
    }
};
