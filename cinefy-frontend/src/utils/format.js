export function formatRating(value) {
  return Number(value) > 0 ? Number(value).toFixed(1) : '–';
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatMonth(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

export function plural(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function truncate(text, max = 22) {
  return text && text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

// Quiet poster tints: same cool family as the accent, varied lightness and hue by genre.
const TINTS = [
  [186, 22, 88],
  [168, 20, 86],
  [204, 20, 89],
  [150, 16, 87],
  [222, 16, 90],
  [176, 14, 84],
  [196, 26, 91],
  [160, 22, 90],
];

export function genreTint(genre = '') {
  let hash = 0;
  for (let i = 0; i < genre.length; i += 1) hash = (hash * 31 + genre.charCodeAt(i)) >>> 0;
  const [h, s, l] = TINTS[hash % TINTS.length];
  return { background: `hsl(${h} ${s}% ${l}%)`, color: `hsl(${h} 30% 22%)`, rule: `hsl(${h} 22% 62%)` };
}

export const CHART_ACCENT = '#2F6F73';
export const CHART_MUTED = '#C5D3D3';
