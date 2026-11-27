// Hand-rolled SVG charts for the Velmora statistics site.
//
// No chart library is used: every chart is plain SVG built from the data,
// so the first load stays small and nothing is fetched from anywhere. Each
// function returns an SVG string; views drop the string into the page and
// the chart is interactive through the buttons and selects around it.

const PALETTE = ['#0b5fa5', '#1d9e6c', '#e07830', '#7a4fa3', '#b03a5b', '#2f7f8f', '#c9a227', '#5b6abf'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Nice round axis steps for a data range.
function axisSteps(max, count = 4) {
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? mag : norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  return { step, top, ticks };
}

function fmtAxis(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1) + 'm';
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
  return String(Math.round(v * 10) / 10);
}

// A line chart with labelled points. labels: x labels, values: numbers.
// The y axis starts just below the smallest value (not at zero) so a slow,
// steady trend is visible instead of a flat line.
export function lineChart({ labels, values, height = 260, color = '#0b5fa5', yLabel = '', formatValue = (v) => String(v) }) {
  const W = 640, H = height, L = 56, R = 14, T = 14, B = 30;
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || 1;
  const { step } = axisSteps(span, 4);
  const lo = Math.floor(rawMin / step) * step;
  const hi = Math.ceil(rawMax / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(v);
  const x = (i) => L + (i * (W - L - R)) / (labels.length - 1);
  const y = (v) => T + (1 - (v - lo) / (hi - lo || 1)) * (H - T - B);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const grid = ticks.map((t) => {
    const gy = y(t);
    return `<line x1="${L}" y1="${gy}" x2="${W - R}" y2="${gy}" class="grid"/><text x="${L - 6}" y="${gy + 4}" class="axis" text-anchor="end">${fmtAxis(t)}</text>`;
  }).join('');
  const dots = values.map((v, i) =>
    `<circle cx="${x(i)}" cy="${y(v)}" r="4" class="dot" fill="${color}"><title>${esc(labels[i])}: ${esc(formatValue(v))}</title></circle>`).join('');
  const xlabels = labels.map((lb, i) =>
    `<text x="${x(i)}" y="${H - 8}" class="axis" text-anchor="middle">${esc(lb)}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart, ${esc(yLabel)}" class="chart">
    ${grid}<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${xlabels}</svg>`;
}

// A vertical bar chart. items: [{label, value}], with value labels on top.
// Dense charts label every second bar with the short format so neighbours
// cannot collide; sparse charts label every bar.
export function barChart({ items, height = 260, color = '#0b5fa5', formatValue = (v) => String(v), shortFormat = null, yLabel = '' }) {
  const W = 640, H = height, L = 56, R = 14, B = 30;
  const T = items.length > 8 ? 30 : 22; // a little room for value labels
  const max = Math.max(...items.map((d) => d.value));
  const { top, ticks } = axisSteps(max, 4);
  const slot = (W - L - R) / items.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => T + (1 - v / (top || 1)) * (H - T - B);
  const grid = ticks.map((t) => {
    const gy = y(t);
    return `<line x1="${L}" y1="${gy}" x2="${W - R}" y2="${gy}" class="grid"/><text x="${L - 6}" y="${gy + 4}" class="axis" text-anchor="end">${fmtAxis(t)}</text>`;
  }).join('');
  const bars = items.map((d, i) => {
    const cx = L + slot * i + slot / 2;
    const top = y(d.value);
    const dense = items.length > 8;
    const showLabel = !dense || i % 2 === 0;
    const labelText = dense && shortFormat ? shortFormat(d.value) : formatValue(d.value);
    const label = showLabel
      ? `<text x="${cx}" y="${(top - 6).toFixed(1)}" class="barval" text-anchor="middle">${esc(labelText)}</text>`
      : '';
    return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - B - top).toFixed(1)}" rx="3" fill="${PALETTE[i % PALETTE.length]}"><title>${esc(d.label)}: ${esc(formatValue(d.value))}</title></rect>
    ${label}
    <text x="${cx}" y="${H - 8}" class="axis" text-anchor="middle">${esc(d.label)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart, ${esc(yLabel)}" class="chart">${grid}${bars}</svg>`;
}

// A horizontal bar chart, best for ranked lists such as regions.
export function hbarChart({ items, height = 300, formatValue = (v) => String(v), yLabel = '' }) {
  const W = 640, L = 110, R = 70, T = 8;
  const rowH = Math.max(30, (height - T - 8) / items.length);
  const H = T + rowH * items.length + 8;
  const max = Math.max(...items.map((d) => d.value));
  const rows = items.map((d, i) => {
    const y = T + rowH * i;
    const w = ((W - L - R) * d.value) / (max || 1);
    return `<text x="${L - 8}" y="${y + rowH / 2 + 4}" class="axis" text-anchor="end">${esc(d.label)}</text>
    <rect x="${L}" y="${y + 5}" width="${w.toFixed(1)}" height="${(rowH - 10).toFixed(1)}" rx="3" fill="${PALETTE[i % PALETTE.length]}"><title>${esc(d.label)}: ${esc(formatValue(d.value))}</title></rect>
    <text x="${L + w + 8}" y="${y + rowH / 2 + 4}" class="barval">${esc(formatValue(d.value))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Horizontal bar chart, ${esc(yLabel)}" class="chart">${rows}</svg>`;
}

// A donut chart with a legend. items: [{label, value}] where values sum to ~100.
export function donutChart({ items, size = 260 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  const total = items.reduce((a, d) => a + d.value, 0);
  let angle = -Math.PI / 2;
  const slices = items.map((d, i) => {
    const frac = d.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${PALETTE[i % PALETTE.length]}"><title>${esc(d.label)}: ${d.value}%</title></path>`;
  }).join('');
  const legend = items.map((d, i) =>
    `<li><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(d.label)} — <strong>${d.value}%</strong></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart" class="donut">${slices}
    <text x="${cx}" y="${cy - 2}" class="donut-centre" text-anchor="middle">100%</text>
    <text x="${cx}" y="${cy + 16}" class="donut-sub" text-anchor="middle">of value added</text></svg>
    <ul class="legend">${legend}</ul></div>`;
}

// A population pyramid: male bars to the left, female to the right.
export function pyramidChart({ bands }) {
  const W = 640, rowH = 15, L = 46, R = 46, T = 24;
  const H = T + rowH * bands.length + 26;
  const max = Math.max(...bands.map((b) => Math.max(b.male, b.female)));
  const mid = W / 2;
  const scale = (mid - L - 14) / max;
  const rows = bands.map((b, i) => {
    const y = T + rowH * i;
    const mw = b.male * scale, fw = b.female * scale;
    return `<rect x="${(mid - mw).toFixed(1)}" y="${y + 2}" width="${mw.toFixed(1)}" height="${rowH - 4}" fill="#0b5fa5"><title>Men ${b.band}: ${b.male}%</title></rect>
    <rect x="${mid}" y="${y + 2}" width="${fw.toFixed(1)}" height="${rowH - 4}" fill="#1d9e6c"><title>Women ${b.band}: ${b.female}%</title></rect>
    <text x="${W / 2}" y="${y + rowH / 2 + 4}" class="pyr-band" text-anchor="middle">${esc(b.band)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Population pyramid, 2026" class="chart">
    <text x="${mid - 70}" y="14" class="axis" text-anchor="middle">Men</text>
    <text x="${mid + 70}" y="14" class="axis" text-anchor="middle">Women</text>
    <line x1="${mid}" y1="${T}" x2="${mid}" y2="${H - 26}" class="grid"/>${rows}
    <text x="${L}" y="${H - 6}" class="axis">Share of population, %</text></svg>`;
}

export { PALETTE };
