export default {
  async fetch(request, env) {
    const key = "behance-counter";
    let count = await env.COUNTER.get(key);
    let num = count ? parseInt(count, 10) : 0;

    num++;
    await env.COUNTER.put(key, String(num));

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
        <rect width="100%" height="100%" fill="#111"/>
        <text x="50%" y="50%" fill="#e60913" font-size="32" text-anchor="middle" dominant-baseline="middle">
          ${num}
        </text>
      </svg>
    `;

    // SVG を base64 に変換
    const url = "data:image/svg+xml;base64," + btoa(svg);

    // Cloudflare の Image API で PNG に変換
    const res = await fetch(url, {
      cf: {
        image: {
          format: "png",
          width: 200,
        },
      },
    });

    return new Response(res.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  }
}
