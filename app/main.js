// Router and wiring for the Velmora statistics site.
//
// Hash routes: #/ (overview), #/population, #/economy, #/health,
// #/education, #/environment, #/regions, #/releases, #/methods,
// #/search?q=…. After each render, this file wires up the controls the
// view contains: the search box, the year pickers, the two calculators,
// the region sorter and finder, and the CSV download buttons. Every
// control does what it says — there is no dead button on the site.

import { VIEWS } from './views.js';
import { META, YEARS, SERIES, REGIONS, INDICATORS, fmtInt, fmtMoneyUsd } from './data.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('.main-nav a')];

function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  const page = path === '' ? 'overview' : path;
  const render = VIEWS[page] || VIEWS.overview;
  let html;
  if (page === 'population' || page === 'economy') {
    const y = Number(params.get('year') || 2026);
    html = render(YEARS.includes(y) ? y : 2026);
  } else if (page === 'regions') {
    html = render(params.get('sort') || 'population');
  } else if (page === 'search') {
    html = render(params.get('q') || '');
  } else {
    html = render();
  }
  app.innerHTML = html;
  navLinks.forEach((a) => {
    const target = a.getAttribute('href').replace(/^#\/?/, '') || 'overview';
    a.setAttribute('aria-current', target === page ? 'page' : 'false');
  });
  window.scrollTo(0, 0);
  wire(page, params);
  document.title = `${page === 'overview' ? 'Velmora in figures' : cap(page)} — ${META.officeShort} · Velmora Statistics`;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function wire(page, params) {
  // Search box (overview): live results as you type, full page on submit.
  const form = document.getElementById('search-form');
  const box = document.getElementById('search-box');
  const results = document.getElementById('search-results');
  if (form && box) {
    const show = () => {
      const q = box.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ''; return; }
      const hits = INDICATORS.filter((d) => (d.name + ' ' + d.topic + ' ' + d.value).toLowerCase().includes(q)).slice(0, 6);
      results.innerHTML = hits.length
        ? `<ul class="results">${hits.map((d) => `<li><a href="${d.page}">${d.name}</a> — <strong>${d.value}</strong> <span class="tag">${d.topic}</span></li>`).join('')}</ul>`
        : '<p class="hint">No indicators match that search.</p>';
    };
    box.addEventListener('input', show);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      location.hash = '#/search?q=' + encodeURIComponent(box.value.trim());
    });
  }

  // Year pickers (population, economy): re-render the page for that year.
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      location.hash = `#/${page}?year=${yearSelect.value}`;
    });
  }

  // Population projector (population page).
  const projector = document.getElementById('projector');
  if (projector) {
    const run = (e) => {
      if (e) e.preventDefault();
      const rate = Number(document.getElementById('proj-rate').value);
      const years = Number(document.getElementById('proj-years').value);
      const base = SERIES.population[10];
      const out = Math.round(base * Math.pow(1 + rate / 100, years));
      document.getElementById('proj-result').textContent =
        `At ${rate}% a year for ${years} years, the population in ${2026 + years} would be about ${fmtInt(out)} — ${fmtInt(out - base)} ${out >= base ? 'more' : 'fewer'} people than in 2026.`;
    };
    projector.addEventListener('submit', run);
    run();
  }

  // Inflation adjuster (economy page).
  const adjuster = document.getElementById('adjuster');
  if (adjuster) {
    const run = (e) => {
      if (e) e.preventDefault();
      const amount = Number(document.getElementById('adj-amount').value);
      const from = Number(document.getElementById('adj-year').value);
      let factor = 1;
      for (let y = from; y < 2026; y += 1) factor *= 1 + SERIES.inflation[YEARS.indexOf(y)] / 100;
      const adjusted = Math.round(amount * factor);
      document.getElementById('adj-result').textContent =
        `₡${fmtInt(amount)} in ${from} buys what ₡${fmtInt(adjusted)} buys in 2026 — prices rose ${((factor - 1) * 100).toFixed(1)}% in between.`;
    };
    adjuster.addEventListener('submit', run);
    run();
  }

  // Region sorter (regions page).
  const sort = document.getElementById('region-sort');
  if (sort) {
    sort.addEventListener('change', () => {
      location.hash = '#/regions?sort=' + sort.value;
    });
  }

  // Region finder (regions page).
  const pick = document.getElementById('region-pick');
  const detail = document.getElementById('region-detail');
  if (pick && detail) {
    const showRegion = () => {
      const r = REGIONS.find((x) => x.name === pick.value) || REGIONS[0];
      const share = ((r.population / SERIES.population[10]) * 100).toFixed(1);
      detail.innerHTML = `<dl class="facts">
        <div><dt>Capital</dt><dd>${r.capital}</dd></div>
        <div><dt>Population</dt><dd>${fmtInt(r.population)} (${share}% of Velmora)</dd></div>
        <div><dt>Area</dt><dd>${fmtInt(r.areaKm2)} km² — ${(r.population / r.areaKm2).toFixed(1)} people per km²</dd></div>
        <div><dt>GDP per person</dt><dd>${fmtMoneyUsd(r.gdpPerCapitaUsd)}</dd></div>
        <div><dt>Unemployment</dt><dd>${r.unemployment.toFixed(1)}%</dd></div>
        <div><dt>Life expectancy</dt><dd>${r.lifeExpectancy.toFixed(1)} years</dd></div>
        <div><dt>Urban population</dt><dd>${r.urbanShare}%</dd></div>
      </dl>`;
    };
    pick.addEventListener('change', showRegion);
    showRegion();
  }

  // CSV downloads (releases page): built in the browser from the dataset.
  const dl = (filename, text) => {
    const blob = new Blob([text], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const btnPop = document.getElementById('dl-population');
  if (btnPop) {
    btnPop.addEventListener('click', () => {
      const rows = ['year,population,gdp_usd_bn,inflation_pct,unemployment_pct,life_expectancy_years'];
      YEARS.forEach((y, i) => rows.push([y, SERIES.population[i], SERIES.gdpUsd[i], SERIES.inflation[i], SERIES.unemployment[i], SERIES.lifeExpectancy[i]].join(',')));
      dl('velmora-population-2016-2026.csv', rows.join('\n') + '\n');
    });
  }
  const btnReg = document.getElementById('dl-regions');
  if (btnReg) {
    btnReg.addEventListener('click', () => {
      const rows = ['region,capital,population,area_km2,gdp_per_capita_usd,unemployment_pct,life_expectancy_years,urban_share_pct'];
      REGIONS.forEach((r) => rows.push([r.name, r.capital, r.population, r.areaKm2, r.gdpPerCapitaUsd, r.unemployment, r.lifeExpectancy, r.urbanShare].join(',')));
      dl('velmora-regions-2026.csv', rows.join('\n') + '\n');
    });
  }
  const btnInd = document.getElementById('dl-indicators');
  if (btnInd) {
    btnInd.addEventListener('click', () => {
      const rows = ['indicator,value,topic,page'];
      INDICATORS.forEach((d) => rows.push([`"${d.name}"`, `"${d.value}"`, d.topic, d.page].join(',')));
      dl('velmora-indicators-2026.csv', rows.join('\n') + '\n');
    });
  }
}

window.addEventListener('hashchange', route);
route();
