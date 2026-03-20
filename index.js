export default {
  async fetch(request, env) {
    const key = "behance-counter";

    // 現在値取得
    let count = await env.COUNTER.get(key);
    let num = count ? parseInt(count, 10) : 0;

    // インクリメント
    num++;
    await env.COUNTER.put(key, String(num));

    // SVG 生成（Behance で画像として表示される）
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
        <rect width="100%" height="100%" fill="#111"/>
        <text x="50%" y="50%" fill="#0f0" font-size="32" text-anchor="middle" dominant-baseline="middle">
          ${num}
        </text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  }
}
