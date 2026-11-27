// Page renderers for the Velmora statistics site.
//
// Each function returns the HTML for one hash route. Views read only from
// data.js and charts.js, so every figure on the site comes from one dataset
// and agrees across pages. Buttons, selects and forms inside a view are
// wired up by main.js after the HTML is placed in the page.

import {
  META, YEARS, SERIES, HEADLINES, AGE_BANDS, REGIONS, SECTORS, ECONOMY_EXTRA,
  HEALTH, EDUCATION, ENVIRONMENT, RELEASES, INDICATORS,
  fmtInt, fmtMoneyUsd, fmtPct, fmtHeadline, valueAt,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart, pyramidChart } from './charts.js';

function sourceLine(source, year) {
  return `<p class="source">Source: ${source}, ${year}. Figures for the fictional country of Velmora.</p>`;
}

function kpiCards() {
  return `<div class="kpi-grid">${HEADLINES.map((h) => `
    <article class="kpi">
      <p class="kpi-label">${h.label}</p>
      <p class="kpi-value">${fmtHeadline(h)}</p>
      <p class="kpi-change">${h.change} <span>${h.changeNote}</span></p>
      <p class="kpi-source">${h.source}</p>
    </article>`).join('')}</div>`;
}

function releaseList(items) {
  return `<ul class="releases">${items.map((r) => `
    <li><time datetime="${r.date}">${r.date}</time>
      <div><a href="#/releases">${r.title}</a><span class="tag">${r.topic}</span>
      <p>${r.summary}</p></div></li>`).join('')}</ul>`;
}

export function viewOverview() {
  const pop = SERIES.population.map((v, i) => ({ label: String(YEARS[i]).slice(2), value: v }));
  return `
  <section class="hero">
    <p class="eyebrow">Republic of Velmora · National Statistics Office</p>
    <h1>Velmora in figures</h1>
    <p class="lede">The official statistics of Velmora — population, economy, health,
    education and environment — published openly, updated monthly, and free for
    everyone to use. Start with the headline numbers, then dig into any topic.</p>
    <form class="search" id="search-form" role="search">
      <label for="search-box">Search indicators</label>
      <input id="search-box" name="q" type="search" placeholder="Try “unemployment”, “literacy” or “forest”…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <div id="search-results" class="search-results" aria-live="polite"></div>
  </section>
  ${kpiCards()}
  <section class="card">
    <h2>Population, 2016–2026</h2>
    <p>Velmora's population grew every year of the last decade, from 7.72 million
    in 2016 to 8.42 million in 2026 — an average of about 0.9% a year, driven
    mostly by net migration since 2022.</p>
    ${lineChart({ labels: YEARS.map((y) => String(y)), values: SERIES.population, yLabel: 'Population', formatValue: (v) => fmtInt(v) + ' people' })}
    ${sourceLine('Population Estimates 2026, VSO', 2026)}
    <p><a class="button" href="#/population">Explore population →</a></p>
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Latest releases</h2>
      ${releaseList(RELEASES.slice(0, 4))}
      <p><a href="#/releases">All releases →</a></p>
    </section>
    <section class="card">
      <h2>Browse by topic</h2>
      <ul class="topic-list">
        <li><a href="#/population">Population</a><span>8.42 million people, age structure, regions</span></li>
        <li><a href="#/economy">Economy</a><span>GDP, jobs, prices, trade and public finance</span></li>
        <li><a href="#/health">Health</a><span>Life expectancy, hospitals, causes of death</span></li>
        <li><a href="#/education">Education</a><span>Schools, literacy and qualifications</span></li>
        <li><a href="#/environment">Environment</a><span>Emissions, renewables, forests and recycling</span></li>
        <li><a href="#/regions">Regions</a><span>Compare Velmora's eight regions side by side</span></li>
      </ul>
    </section>
  </div>
  <section class="card note">
    <h2>About these numbers</h2>
    <p>Velmora is a fictional country. Its statistics are invented for this site so
    every figure can be concrete and consistent without misdescribing a real
    place. Each table names its source publication and reference year, and the
    methods page explains how every figure is produced.</p>
    <p><a href="#/methods">How the figures are made →</a></p>
  </section>`;
}

export function viewPopulation(year = 2026) {
  const pop = valueAt('population', year);
  const idx = YEARS.indexOf(year);
  const prev = idx > 0 ? SERIES.population[idx - 1] : null;
  const growth = prev ? ((pop - prev) / prev) * 100 : 0;
  const young = 16.8, working = 66.4, older = 16.8;
  const dependency = ((young + older) / working) * 100;
  return `
  <h1>Population</h1>
  <p class="lede">How many people live in Velmora, how old they are, where they live,
  and how the population is changing.</p>
  <label class="year-pick">Year
    <select id="year-select" data-series="population">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
  </label>
  <div class="stat-row">
    <div class="stat"><span>Population in ${year}</span><strong>${fmtInt(pop)}</strong></div>
    <div class="stat"><span>Change on previous year</span><strong>+${fmtPct(growth, 2)}</strong></div>
    <div class="stat"><span>Median age</span><strong>41.2 years</strong></div>
    <div class="stat"><span>Dependency ratio</span><strong>${dependency.toFixed(1)} per 100 working-age</strong></div>
  </div>
  <section class="card">
    <h2>Population, 2016–2026</h2>
    ${lineChart({ labels: YEARS.map(String), values: SERIES.population, yLabel: 'Population', formatValue: (v) => fmtInt(v) })}
    ${sourceLine('Population Estimates 2026, VSO', 2026)}
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Age structure, 2026</h2>
      <p>Children (0–14) are ${fmtPct(young)} of the population, working-age people
      (15–64) ${fmtPct(working)}, and people 65 and over ${fmtPct(older)}.</p>
      ${pyramidChart({ bands: AGE_BANDS })}
      ${sourceLine('Population Estimates 2026, VSO', 2026)}
    </section>
    <section class="card">
      <h2>Population projector</h2>
      <p>Project the population forward at a growth rate you choose. The projector
      compounds the chosen annual rate from the 2026 population of ${fmtInt(SERIES.population[10])}.</p>
      <form id="projector" class="calc">
        <label>Annual growth rate (%) <input id="proj-rate" type="number" step="0.1" min="-2" max="5" value="0.9"></label>
        <label>Years ahead <input id="proj-years" type="number" step="1" min="1" max="50" value="10"></label>
        <button type="submit">Project</button>
      </form>
      <p class="calc-result" id="proj-result" aria-live="polite"></p>
      <p class="hint">Try 0.9% for 10 years: the official medium projection is 9.21 million in 2036.</p>
    </section>
  </div>
  <section class="card">
    <h2>Population by region, 2026</h2>
    <p>The eight regions sum to the national total of ${fmtInt(SERIES.population[10])}.</p>
    ${hbarChart({ items: [...REGIONS].sort((a, b) => b.population - a.population).map((r) => ({ label: r.name, value: r.population })), formatValue: (v) => fmtInt(v), yLabel: 'People' })}
    <p><a class="button" href="#/regions">Compare all regions →</a></p>
  </section>`;
}

export function viewEconomy(year = 2026) {
  const gdp = valueAt('gdpUsd', year);
  const gdpVcr = valueAt('gdpVcr', year);
  const idx = YEARS.indexOf(year);
  const prev = idx > 0 ? SERIES.gdpUsd[idx - 1] : null;
  const infl = valueAt('inflation', year);
  const unemp = valueAt('unemployment', year);
  const perCapita = Math.round((gdp * 1e9) / valueAt('population', year));
  return `
  <h1>Economy</h1>
  <p class="lede">Output, jobs, prices, trade and public finance — the economy in
  the numbers that matter, with ten years of history behind each one.</p>
  <label class="year-pick">Year
    <select id="year-select" data-series="gdpUsd">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
  </label>
  <div class="stat-row">
    <div class="stat"><span>GDP in ${year}</span><strong>$${gdp.toFixed(1)}bn</strong></div>
    <div class="stat"><span>GDP in crowns</span><strong>₡${gdpVcr.toFixed(1)}bn</strong></div>
    <div class="stat"><span>GDP per person</span><strong>${fmtMoneyUsd(perCapita)}</strong></div>
    <div class="stat"><span>Inflation</span><strong>${fmtPct(infl)}</strong></div>
    <div class="stat"><span>Unemployment</span><strong>${fmtPct(unemp)}</strong></div>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>GDP, 2016–2026 (US$ billion)</h2>
      ${barChart({ items: YEARS.map((y, i) => ({ label: String(y).slice(2), value: SERIES.gdpUsd[i] })), formatValue: (v) => '$' + v.toFixed(1) + 'bn', shortFormat: (v) => '$' + v.toFixed(1), yLabel: 'GDP, US$ billion' })}
      ${sourceLine('National Accounts, Q3 2026, VSO', 2026)}
      <p>The 2020 dip (−6.3%) is the pandemic recession; output passed its 2019
      level again in 2021 and has grown every year since.</p>
    </section>
    <section class="card">
      <h2>What the economy makes</h2>
      <p>Shares of gross value added, 2026. Services dominate at ${fmtPct(SECTORS[0].share)}.</p>
      ${donutChart({ items: SECTORS.map((s) => ({ label: s.name, value: s.share })) })}
      <ul class="plain">${SECTORS.map((s) => `<li><strong>${s.name}:</strong> ${s.note}</li>`).join('')}</ul>
      ${sourceLine('National Accounts, Q3 2026, VSO', 2026)}
    </section>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Inflation and unemployment</h2>
      ${lineChart({ labels: YEARS.map(String), values: SERIES.inflation, color: '#e07830', yLabel: 'Inflation, %', formatValue: (v) => fmtPct(v) })}
      <p>Inflation peaked at ${fmtPct(5.9)} in 2022 and has fallen every year since,
      to ${fmtPct(2.3)} in 2026 — inside the central bank's 2% target band's
      upper edge. Unemployment fell to ${fmtPct(4.1)} in 2026, the lowest in the series.</p>
      ${sourceLine('Consumer Prices, Oct 2026; Labour Force Survey, Oct 2026, VSO', 2026)}
    </section>
    <section class="card">
      <h2>Trade and public finance, 2026</h2>
      <dl class="facts">
        <div><dt>Exports</dt><dd>${fmtMoneyUsd(ECONOMY_EXTRA.exportsUsdBn, 1)}bn</dd></div>
        <div><dt>Imports</dt><dd>${fmtMoneyUsd(ECONOMY_EXTRA.importsUsdBn, 1)}bn</dd></div>
        <div><dt>Trade balance</dt><dd>+$${ECONOMY_EXTRA.tradeBalanceUsdBn.toFixed(1)}bn surplus</dd></div>
        <div><dt>Government revenue</dt><dd>${fmtPct(ECONOMY_EXTRA.govRevenuePctGdp)} of GDP</dd></div>
        <div><dt>Government spending</dt><dd>${fmtPct(ECONOMY_EXTRA.govSpendingPctGdp)} of GDP</dd></div>
        <div><dt>Government debt</dt><dd>${fmtPct(ECONOMY_EXTRA.govDebtPctGdp)} of GDP</dd></div>
        <div><dt>Average monthly wage</dt><dd>₡${fmtInt(ECONOMY_EXTRA.averageWageVcr)} (${fmtMoneyUsd(ECONOMY_EXTRA.averageWageUsd)})</dd></div>
        <div><dt>Minimum monthly wage</dt><dd>₡${fmtInt(ECONOMY_EXTRA.minimumWageVcr)}</dd></div>
      </dl>
      <h3>Biggest exports</h3>
      ${hbarChart({ items: ECONOMY_EXTRA.topExports.map((e) => ({ label: e.good, value: e.valueUsdBn })), formatValue: (v) => '$' + v.toFixed(1) + 'bn', yLabel: 'US$ billion' })}
      <h3>Biggest trading partners</h3>
      <ul class="plain">${ECONOMY_EXTRA.topPartners.map((p) => `<li>${p.country} — <strong>${fmtPct(p.share)}</strong> of trade</li>`).join('')}</ul>
      ${sourceLine('Trade Statistics 2026; Public Finance 2026, VSO', 2026)}
    </section>
  </div>
  <section class="card">
    <h2>What is a crown worth? Inflation adjuster</h2>
    <p>Convert an amount in an earlier year into 2026 crowns using the CPI series.
    The adjuster compounds the inflation rates between the two years.</p>
    <form id="adjuster" class="calc">
      <label>Amount (₡) <input id="adj-amount" type="number" step="1" min="1" value="1000"></label>
      <label>From year
        <select id="adj-year">${YEARS.slice(0, 10).map((y) => `<option value="${y}">${y}</option>`).join('')}</select>
      </label>
      <button type="submit">Adjust to 2026</button>
    </form>
    <p class="calc-result" id="adj-result" aria-live="polite"></p>
  </section>`;
}

export function viewHealth() {
  return `
  <h1>Health</h1>
  <p class="lede">How long Velmorans live, what they die of, and the health system
  that looks after them.</p>
  <div class="stat-row">
    <div class="stat"><span>Life expectancy</span><strong>79.4 years</strong></div>
    <div class="stat"><span>Women</span><strong>${HEALTH.lifeExpectancyFemale.toFixed(1)} years</strong></div>
    <div class="stat"><span>Men</span><strong>${HEALTH.lifeExpectancyMale.toFixed(1)} years</strong></div>
    <div class="stat"><span>Infant mortality</span><strong>${HEALTH.infantMortalityPer1000} per 1,000 births</strong></div>
    <div class="stat"><span>Health spending</span><strong>${fmtPct(HEALTH.healthSpendPctGdp)} of GDP</strong></div>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Life expectancy, 2016–2026</h2>
      ${lineChart({ labels: YEARS.map(String), values: SERIES.lifeExpectancy, color: '#1d9e6c', yLabel: 'Years', formatValue: (v) => v.toFixed(1) + ' years' })}
      <p>Life expectancy rose 1.5 years over the decade, interrupted only by the
      2020 pandemic dip to 78.2 years. The gap between women and men is 4.7 years.</p>
      ${sourceLine('Life Tables 2026, VSO', 2026)}
    </section>
    <section class="card">
      <h2>What Velmorans die of, 2026</h2>
      ${hbarChart({ items: HEALTH.causesOfDeath.map((c) => ({ label: c.cause, value: c.share })), formatValue: (v) => fmtPct(v), yLabel: 'Share of deaths, %' })}
      <p>Heart disease and cancer together account for more than half of all deaths.</p>
      ${sourceLine(HEALTH.source, 2026)}
    </section>
  </div>
  <section class="card">
    <h2>The health system in numbers, 2026</h2>
    <dl class="facts">
      <div><dt>Doctors</dt><dd>${HEALTH.doctorsPer1000} per 1,000 people</dd></div>
      <div><dt>Nurses and midwives</dt><dd>${HEALTH.nursesPer1000} per 1,000 people</dd></div>
      <div><dt>Hospital beds</dt><dd>${HEALTH.hospitalBedsPer1000} per 1,000 people</dd></div>
      <div><dt>Health spending per person</dt><dd>${fmtMoneyUsd(HEALTH.healthSpendPerCapitaUsd)}</dd></div>
      <div><dt>Adults who smoke</dt><dd>${fmtPct(HEALTH.smokingAdultsPct)}</dd></div>
      <div><dt>Adults living with obesity</dt><dd>${fmtPct(HEALTH.obesityAdultsPct)}</dd></div>
    </dl>
    ${sourceLine(HEALTH.source, 2026)}
  </section>`;
}

export function viewEducation() {
  return `
  <h1>Education</h1>
  <p class="lede">Schools, students and qualifications — who learns what in Velmora,
  and how far they get.</p>
  <div class="stat-row">
    <div class="stat"><span>Adult literacy</span><strong>${fmtPct(EDUCATION.literacyAdult)}</strong></div>
    <div class="stat"><span>Youth literacy</span><strong>${fmtPct(EDUCATION.literacyYouth)}</strong></div>
    <div class="stat"><span>Primary enrolment</span><strong>${fmtPct(EDUCATION.enrolPrimary)}</strong></div>
    <div class="stat"><span>Secondary enrolment</span><strong>${fmtPct(EDUCATION.enrolSecondary)}</strong></div>
    <div class="stat"><span>Tertiary enrolment</span><strong>${fmtPct(EDUCATION.enrolTertiary)}</strong></div>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Highest qualification, adults 25–64, 2026</h2>
      ${hbarChart({ items: EDUCATION.attainment.map((a) => ({ label: a.level, value: a.share })), formatValue: (v) => fmtPct(v), yLabel: 'Share of adults, %' })}
      <p>A quarter of working-age adults hold a university degree, up from 18.9% in 2016.</p>
      ${sourceLine(EDUCATION.source, 2026)}
    </section>
    <section class="card">
      <h2>Schooling in numbers, 2026</h2>
      <dl class="facts">
        <div><dt>Mean years of schooling</dt><dd>${EDUCATION.meanYearsSchooling} years</dd></div>
        <div><dt>Pupils per teacher, primary</dt><dd>${EDUCATION.pupilsPerTeacherPrimary}</dd></div>
        <div><dt>Pupils per teacher, secondary</dt><dd>${EDUCATION.pupilsPerTeacherSecondary}</dd></div>
        <div><dt>Education spending</dt><dd>${fmtPct(EDUCATION.spendPctGdp)} of GDP</dd></div>
        <div><dt>Primary schools</dt><dd>1,842</dd></div>
        <div><dt>Secondary schools</dt><dd>617</dd></div>
        <div><dt>Universities and colleges</dt><dd>23</dd></div>
      </dl>
      <p>Enrolment is counted as the share of children of the official age for each
      level who are enrolled; primary enrolment has been above 99% since 2019.</p>
      ${sourceLine(EDUCATION.source, 2026)}
    </section>
  </div>`;
}

export function viewEnvironment() {
  return `
  <h1>Environment</h1>
  <p class="lede">Emissions, energy, forests and waste — Velmora's footprint on the
  land it lives on.</p>
  <div class="stat-row">
    <div class="stat"><span>CO2 per person</span><strong>${ENVIRONMENT.co2PerCapitaTonnes} tonnes</strong></div>
    <div class="stat"><span>Renewable electricity</span><strong>${fmtPct(ENVIRONMENT.renewablesShareElectricity)}</strong></div>
    <div class="stat"><span>Forest cover</span><strong>${fmtPct(ENVIRONMENT.forestCoverPct)} of land</strong></div>
    <div class="stat"><span>Protected land</span><strong>${fmtPct(ENVIRONMENT.protectedLandPct)}</strong></div>
    <div class="stat"><span>Recycling rate</span><strong>${fmtPct(ENVIRONMENT.recyclingRatePct)}</strong></div>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Greenhouse gas emissions, 2016–2026</h2>
      ${lineChart({ labels: YEARS.map(String), values: SERIES.emissions, color: '#2f7f8f', yLabel: 'Million tonnes CO2e', formatValue: (v) => v.toFixed(1) + ' Mt' })}
      <p>Emissions fell 16% over the decade, from 48.2 to 40.4 million tonnes,
      while the economy grew 44% — Velmora now emits less per crown of output
      than at any point in the series.</p>
      ${sourceLine(ENVIRONMENT.source, 2026)}
    </section>
    <section class="card">
      <h2>Where electricity comes from, 2026</h2>
      ${donutChart({ items: ENVIRONMENT.energyMix.map((e) => ({ label: e.source, value: e.share })) })}
      <p>Renewables — hydro, wind and solar — supplied ${fmtPct(ENVIRONMENT.renewablesShareElectricity)}
      of electricity in 2026, up from ${fmtPct(31.4)} in 2016.</p>
      ${sourceLine(ENVIRONMENT.source, 2026)}
    </section>
  </div>
  <section class="card">
    <h2>Air, land and waste, 2026</h2>
    <dl class="facts">
      <div><dt>Days with good air quality</dt><dd>${ENVIRONMENT.airQualityGoodDays} of 365</dd></div>
      <div><dt>Forest cover</dt><dd>${fmtPct(ENVIRONMENT.forestCoverPct)} of land area</dd></div>
      <div><dt>Protected land</dt><dd>${fmtPct(ENVIRONMENT.protectedLandPct)} of land area</dd></div>
      <div><dt>Household waste recycled</dt><dd>${fmtPct(ENVIRONMENT.recyclingRatePct)}</dd></div>
      <div><dt>Renewable share, 2016</dt><dd>${fmtPct(31.4)}</dd></div>
      <div><dt>Renewable share, 2026</dt><dd>${fmtPct(ENVIRONMENT.renewablesShareElectricity)}</dd></div>
    </dl>
    ${sourceLine(ENVIRONMENT.source, 2026)}
  </section>`;
}

export function viewRegions(sortKey = 'population') {
  const rows = [...REGIONS];
  const sorts = {
    population: (a, b) => b.population - a.population,
    name: (a, b) => a.name.localeCompare(b.name),
    gdp: (a, b) => b.gdpPerCapitaUsd - a.gdpPerCapitaUsd,
    unemployment: (a, b) => a.unemployment - b.unemployment,
    life: (a, b) => b.lifeExpectancy - a.lifeExpectancy,
  };
  rows.sort(sorts[sortKey] || sorts.population);
  const total = REGIONS.reduce((a, r) => a + r.population, 0);
  const density = (r) => (r.population / r.areaKm2).toFixed(1);
  return `
  <h1>Regions</h1>
  <p class="lede">Velmora has eight regions. Compare them on population, income,
  jobs and health — the table sorts, and the chart ranks them by people.</p>
  <section class="card">
    <h2>Population by region, 2026</h2>
    ${hbarChart({ items: [...REGIONS].sort((a, b) => b.population - a.population).map((r) => ({ label: r.name, value: r.population })), formatValue: (v) => fmtInt(v), yLabel: 'People' })}
    <p>Alden holds ${fmtPct((REGIONS[0].population / total) * 100)} of the national
    population; Gorran, the largest by land, holds ${fmtPct((REGIONS[7].population / total) * 100)}.</p>
  </section>
  <section class="card">
    <h2>Compare the regions</h2>
    <label class="year-pick">Sort by
      <select id="region-sort">
        <option value="population"${sortKey === 'population' ? ' selected' : ''}>Population (largest first)</option>
        <option value="name"${sortKey === 'name' ? ' selected' : ''}>Name (A–Z)</option>
        <option value="gdp"${sortKey === 'gdp' ? ' selected' : ''}>GDP per person (highest first)</option>
        <option value="unemployment"${sortKey === 'unemployment' ? ' selected' : ''}>Unemployment (lowest first)</option>
        <option value="life"${sortKey === 'life' ? ' selected' : ''}>Life expectancy (highest first)</option>
      </select>
    </label>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Region</th><th>Capital</th><th>Population</th><th>Area (km²)</th><th>Density (/km²)</th><th>GDP per person</th><th>Unemployment</th><th>Life expectancy</th><th>Urban</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td><strong>${r.name}</strong></td><td>${r.capital}</td><td>${fmtInt(r.population)}</td>
        <td>${fmtInt(r.areaKm2)}</td><td>${density(r)}</td><td>${fmtMoneyUsd(r.gdpPerCapitaUsd)}</td>
        <td>${fmtPct(r.unemployment)}</td><td>${r.lifeExpectancy.toFixed(1)} yrs</td><td>${fmtPct(r.urbanShare, 0)}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    ${sourceLine('Regional Accounts 2025; Population Estimates 2026, VSO', 2026)}
  </section>
  <section class="card">
    <h2>Region finder</h2>
    <p>Pick a region to see its key figures at a glance.</p>
    <label class="year-pick">Region
      <select id="region-pick">${REGIONS.map((r) => `<option value="${r.name}">${r.name}</option>`).join('')}</select>
    </label>
    <div id="region-detail" aria-live="polite"></div>
  </section>`;
}

export function viewReleases() {
  return `
  <h1>Statistical releases</h1>
  <p class="lede">Every release from the Velmora Statistics Office, newest first.
  Each release names its topic and its headline finding; the full tables
  behind each one are in the downloads below.</p>
  ${releaseList(RELEASES)}
  <section class="card">
    <h2>Download the data</h2>
    <p>Take the figures on this site with you. Each file is generated in your
    browser from the same dataset the pages use — no account, no sign-up.</p>
    <p>
      <button class="button" id="dl-population" type="button">Download population 2016–2026 (CSV)</button>
      <button class="button" id="dl-regions" type="button">Download regions 2026 (CSV)</button>
      <button class="button" id="dl-indicators" type="button">Download indicator index (CSV)</button>
    </p>
    <p class="hint">Files download as .csv and open in any spreadsheet.</p>
  </section>`;
}

export function viewMethods() {
  return `
  <h1>Methods, sources and about</h1>
  <p class="lede">How the Velmora Statistics Office produces these figures, what
  each one means, and who to contact with a question.</p>
  <section class="card">
    <h2>How the figures are made</h2>
    <ul class="plain">
      <li><strong>Population:</strong> mid-year estimates from the population register, births, deaths and migration records, revised each November.</li>
      <li><strong>Economy:</strong> national accounts compiled to the Velmora System of Accounts 2018; GDP in crowns is converted to dollars at the annual average market rate.</li>
      <li><strong>Prices:</strong> the consumer price index tracks a basket of 620 goods and services priced monthly in 42 towns.</li>
      <li><strong>Labour:</strong> the Labour Force Survey interviews 12,000 households each quarter; unemployment follows the standard definition of without work, available to start, and seeking work.</li>
      <li><strong>Health and education:</strong> administrative records from ministries, checked against survey samples each year.</li>
      <li><strong>Environment:</strong> emissions are estimated from energy use and industrial returns; the renewable share counts hydro, wind and solar generation.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Definitions</h2>
    <dl class="facts">
      <div><dt>GDP per person</dt><dd>Gross domestic product divided by the mid-year population.</dd></div>
      <div><dt>Dependency ratio</dt><dd>People aged 0–14 and 65+ per 100 people aged 15–64.</dd></div>
      <div><dt>Median age</dt><dd>The age that splits the population in half — half younger, half older.</dd></div>
      <div><dt>Life expectancy</dt><dd>The average years a newborn would live if current death rates stayed the same.</dd></div>
      <div><dt>Urban share</dt><dd>The share of a region's population living in towns of 10,000 or more.</dd></div>
    </dl>
  </section>
  <section class="card">
    <h2>About the Velmora Statistics Office</h2>
    <p>The VSO is Velmora's independent national statistics office, founded in
    1948. It publishes under the Velmora Statistics Act, which requires its
    figures to be produced free of political direction and released to
    everyone at the same time. This site is its public front door: every
    figure here carries its source publication and reference year.</p>
    <p><strong>Contact:</strong> Velmora Statistics Office, 1 Register Square,
    Alden City, Velmora · enquiries@vso.velmora.example · +380 2 555 0140</p>
    <p class="hint">Velmora is a fictional country; the office, its address and its
    figures are invented for this site.</p>
  </section>`;
}

export function viewSearch(q) {
  const needle = q.trim().toLowerCase();
  const hits = needle
    ? INDICATORS.filter((d) => (d.name + ' ' + d.topic + ' ' + d.value).toLowerCase().includes(needle))
    : [];
  return `
  <h1>Search results</h1>
  <p class="lede">${needle ? `Indicators matching “${q.trim()}”.` : 'Type a word in the search box on the home page to find an indicator.'}</p>
  ${needle && hits.length === 0 ? '<p>No indicators match that search. Try “population”, “jobs”, “school” or “forest”.</p>' : ''}
  ${hits.length ? `<ul class="results">${hits.map((d) => `<li><a href="${d.page}">${d.name}</a> — <strong>${d.value}</strong> <span class="tag">${d.topic}</span></li>`).join('')}</ul>` : ''}
  <p><a href="#/">← Back to the overview</a></p>`;
}

export const VIEWS = {
  overview: viewOverview,
  population: viewPopulation,
  economy: viewEconomy,
  health: viewHealth,
  education: viewEducation,
  environment: viewEnvironment,
  regions: viewRegions,
  releases: viewReleases,
  methods: viewMethods,
  search: viewSearch,
};

export { META };
