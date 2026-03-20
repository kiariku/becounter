import wasm from "./resvg.wasm";
import { Resvg } from "@resvg/resvg-wasm";

export default {
  async fetch(request, env) {
    // WASM 初期化
    await Resvg.initWasm(wasm);

    // カウンター読み込み
    const key = "behance-counter";
    let count = await env.COUNTER.get(key);
    let num = count ? parseInt(count, 10) : 0;

    // カウントアップ
    num++;
    await env.COUNTER.put(key, String(num));

    // SVG（数字の色は #e60913）
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
        <rect width="100%" height="100%" fill="#111"/>
        <text x="50%" y="50%" fill="#e60913" font-size="32" text-anchor="middle" dominant-baseline="middle">
          ${num}
        </text>
      </svg>
    `;

    // SVG → PNG 変換
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 200 }
    });

    const pngData = resvg.render().asPng();

    // PNG を返す
    return new Response(pngData, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  }
}
