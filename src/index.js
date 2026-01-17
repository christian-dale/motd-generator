const motdQuotes = [
    "Build things that still make sense at 3 a.m.",
    "If it works but you don't understand it, it's broken.",
    "No magic. Just systems, iteration, and receipts.",
    "Order, carved patiently out of chaos.",
    "Readable code is a feature. Everything else is negotiable.",
    "Refuse shortcuts. Ship anyway."
];

export default {
    async fetch(request, env, ctx) {
        const motd = motdQuotes[
            (new Date().getDate() * motdQuotes.length) % motdQuotes.length
        ];

        const svg = `
            <svg width="600" height="120" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
                <text
                x="2%" 
                y="20%"
                font-family="monospace" 
                font-size="14">
                    ${motd}
                </text>
            </svg>
        `;

        return new Response(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        });
    }
};
