// Generates self-contained placeholder product images as SVG data URIs.
// These render with no network dependency (unlike placehold.co), so seeded
// products always show a dummy image in the UI.

const PALETTES = {
  Men: ["#20344f", "#0d1826"],
  Women: ["#4f2036", "#260d18"],
  "Top Wear": ["#1f4a3a", "#0d1f18"],
  "Bottom Wear": ["#333650", "#161826"],
  Accessories: ["#4f3a1f", "#26180d"],
  default: ["#2b2b2b", "#0f0f0f"],
};

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const svg = (name, label, c1, c2) => {
  const markup = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs>
<rect width='600' height='800' fill='url(#g)'/>
<rect x='28' y='28' width='544' height='744' fill='none' stroke='rgba(255,255,255,0.16)' stroke-width='2'/>
<circle cx='300' cy='300' r='70' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='2'/>
<text x='300' y='315' font-family='Georgia, serif' font-size='60' fill='rgba(255,255,255,0.5)' text-anchor='middle'>${esc(name.trim().charAt(0).toUpperCase())}</text>
<text x='300' y='470' font-family='Georgia, serif' font-size='32' fill='#ffffff' text-anchor='middle'>${esc(name)}</text>
<text x='300' y='508' font-family='Arial, sans-serif' font-size='15' letter-spacing='5' fill='rgba(255,255,255,0.55)' text-anchor='middle'>${esc(label).toUpperCase()}</text>
<text x='300' y='748' font-family='Arial, sans-serif' font-size='13' letter-spacing='7' fill='rgba(255,255,255,0.4)' text-anchor='middle'>NIVORA</text>
</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(markup);
};

/**
 * Returns an array of 3 placeholder image data URIs for a product.
 * @param {string} name - product name
 * @param {string} category - product category (drives the color palette)
 */
const productImages = (name, category) => {
  const [c1, c2] = PALETTES[category] || PALETTES.default;
  return [
    svg(name, "Front", c1, c2),
    svg(name, "Back", c2, c1),
    svg(name, "Detail", c1, c2),
  ];
};

module.exports = { productImages };
