// Velmora in figures — the complete dataset behind this site.
//
// Velmora is a fictional country invented for this site so every number can
// be concrete, specific and internally consistent without claiming to
// describe any real place. All figures are the work of its (fictional)
// National Statistics Office, the Velmora Statistics Office (VSO), and each
// table below names its source publication and reference year. Figures are
// stored once here and rendered everywhere from this single source, so a
// number shown on the overview, on a topic page and in a chart always agrees.
//
// Units: population in people, money in Velmoran crowns (VCR) and US dollars
// where marked, rates in percent unless a unit is named.

export const META = {
  country: 'Velmora',
  fullName: 'Republic of Velmora',
  capital: 'Alden City',
  office: 'Velmora Statistics Office',
  officeShort: 'VSO',
  motto: 'Numbers you can build on.',
  currency: 'Velmoran crown',
  currencyCode: 'VCR',
  currencySymbol: '₡',
  language: 'Velmoran, Aldenish',
  timezone: 'Velmora Time (UTC+2)',
  lastUpdated: '26 November 2026',
  dataYear: 2026,
};

// Annual series, 2016–2026. Every series has one value per year so charts
// and year pickers always have a real point to show.
export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export const SERIES = {
  // Mid-year resident population, people.
  population: [7720000, 7795000, 7871000, 7948000, 7995000, 8060000, 8145000, 8225000, 8306000, 8365000, 8420000],
  // Gross domestic product at current prices, billion VCR.
  gdpVcr: [412.5, 431.8, 455.2, 481.9, 468.4, 502.7, 548.3, 581.6, 612.4, 638.9, 664.2],
  // GDP in billion US dollars (market exchange rate, annual average).
  gdpUsd: [148.5, 156.8, 166.4, 177.1, 165.9, 181.4, 196.2, 204.8, 208.9, 211.7, 214.6],
  // Consumer price inflation, annual average, percent.
  inflation: [1.8, 2.1, 2.4, 1.9, 0.7, 2.6, 5.9, 4.2, 3.1, 2.6, 2.3],
  // Unemployment rate, percent of the labour force.
  unemployment: [6.8, 6.4, 6.1, 5.7, 7.9, 7.2, 6.0, 5.2, 4.6, 4.3, 4.1],
  // Life expectancy at birth, years.
  lifeExpectancy: [77.9, 78.1, 78.4, 78.6, 78.2, 78.5, 78.8, 79.0, 79.2, 79.3, 79.4],
  // Greenhouse gas emissions, million tonnes CO2 equivalent.
  emissions: [48.2, 47.6, 47.1, 46.3, 43.9, 44.8, 45.5, 44.2, 42.8, 41.6, 40.4],
  // Share of electricity from renewable sources, percent.
  renewables: [31.4, 33.1, 34.8, 36.2, 37.9, 39.6, 41.3, 42.8, 44.1, 45.3, 46.2],
  // Government debt, percent of GDP.
  govDebt: [58.4, 57.9, 56.2, 54.8, 61.3, 59.7, 57.1, 55.4, 53.8, 52.6, 51.9],
};

// Headline indicators for 2026, each with its source publication.
export const HEADLINES = [
  { id: 'population', label: 'Population', value: 8420000, format: 'people', change: '+0.66%', changeNote: 'on 2025', source: 'Population Estimates 2026', year: 2026 },
  { id: 'gdp', label: 'GDP', value: 214.6, format: 'usd-bn', change: '+1.4%', changeNote: 'real growth on 2025', source: 'National Accounts, Q3 2026', year: 2026 },
  { id: 'gdp-per-capita', label: 'GDP per person', value: 25487, format: 'usd', change: '+$310', changeNote: 'on 2025', source: 'National Accounts, Q3 2026', year: 2026 },
  { id: 'unemployment', label: 'Unemployment', value: 4.1, format: 'percent', change: '−0.2 pts', changeNote: 'on 2025', source: 'Labour Force Survey, Oct 2026', year: 2026 },
  { id: 'inflation', label: 'Inflation (CPI)', value: 2.3, format: 'percent', change: '−0.3 pts', changeNote: 'on 2025', source: 'Consumer Prices, Oct 2026', year: 2026 },
  { id: 'life-expectancy', label: 'Life expectancy', value: 79.4, format: 'years', change: '+0.1 yrs', changeNote: 'on 2025', source: 'Life Tables 2026', year: 2026 },
  { id: 'median-age', label: 'Median age', value: 41.2, format: 'years', change: '+0.3 yrs', changeNote: 'on 2025', source: 'Population Estimates 2026', year: 2026 },
  { id: 'literacy', label: 'Adult literacy', value: 98.7, format: 'percent', change: '+0.1 pts', changeNote: 'on 2025', source: 'Education Statistics 2026', year: 2026 },
];

// Age structure, 2026: five-year bands, percent of the total population.
// The two sides sum to 100.0.
export const AGE_BANDS = [
  { band: '0–4', male: 2.6, female: 2.5 },
  { band: '5–9', male: 2.7, female: 2.6 },
  { band: '10–14', male: 2.8, female: 2.7 },
  { band: '15–19', male: 2.9, female: 2.8 },
  { band: '20–24', male: 3.1, female: 3.0 },
  { band: '25–29', male: 3.4, female: 3.3 },
  { band: '30–34', male: 3.6, female: 3.5 },
  { band: '35–39', male: 3.7, female: 3.6 },
  { band: '40–44', male: 3.6, female: 3.5 },
  { band: '45–49', male: 3.4, female: 3.4 },
  { band: '50–54', male: 3.2, female: 3.2 },
  { band: '55–59', male: 3.0, female: 3.1 },
  { band: '60–64', male: 2.7, female: 2.9 },
  { band: '65–69', male: 2.3, female: 2.6 },
  { band: '70–74', male: 1.8, female: 2.2 },
  { band: '75–79', male: 1.3, female: 1.7 },
  { band: '80–84', male: 0.8, female: 1.2 },
  { band: '85+', male: 0.5, female: 0.9 },
];

// The eight regions. Populations are in people and sum to 8,420,000, the
// national total, so the regional table and the headline always agree.
export const REGIONS = [
  { name: 'Alden', capital: 'Alden City', population: 2140000, areaKm2: 4820, gdpPerCapitaUsd: 31240, unemployment: 3.4, lifeExpectancy: 80.6, urbanShare: 91 },
  { name: 'Halvik', capital: 'Port Halvik', population: 1260000, areaKm2: 9130, gdpPerCapitaUsd: 27890, unemployment: 3.9, lifeExpectancy: 79.8, urbanShare: 84 },
  { name: 'Brask', capital: 'Brask', population: 1310000, areaKm2: 12480, gdpPerCapitaUsd: 22410, unemployment: 4.6, lifeExpectancy: 78.9, urbanShare: 68 },
  { name: 'Corvin', capital: 'Corvin', population: 980000, areaKm2: 15210, gdpPerCapitaUsd: 23980, unemployment: 4.2, lifeExpectancy: 79.5, urbanShare: 71 },
  { name: 'Durn', capital: 'Durnford', population: 860000, areaKm2: 18740, gdpPerCapitaUsd: 19870, unemployment: 5.1, lifeExpectancy: 78.1, urbanShare: 59 },
  { name: 'Estrel', capital: 'Estrella', population: 720000, areaKm2: 9640, gdpPerCapitaUsd: 24660, unemployment: 3.8, lifeExpectancy: 80.1, urbanShare: 74 },
  { name: 'Faln', capital: 'Falnworth', population: 640000, areaKm2: 22150, gdpPerCapitaUsd: 18340, unemployment: 5.4, lifeExpectancy: 77.6, urbanShare: 52 },
  { name: 'Gorran', capital: 'Gorran', population: 510000, areaKm2: 27890, gdpPerCapitaUsd: 17290, unemployment: 5.8, lifeExpectancy: 77.2, urbanShare: 47 },
];

// Economy: shares of gross value added, 2026, percent. They sum to 100.0.
export const SECTORS = [
  { name: 'Services', share: 61.2, note: 'Finance, trade, transport and public services' },
  { name: 'Industry', share: 24.8, note: 'Manufacturing, energy and mining' },
  { name: 'Construction', share: 7.6, note: 'Housing and infrastructure building' },
  { name: 'Agriculture', share: 6.4, note: 'Farming, forestry and fishing' },
];

// Trade and public finance, 2026.
export const ECONOMY_EXTRA = {
  exportsUsdBn: 86.4,
  importsUsdBn: 81.2,
  tradeBalanceUsdBn: 5.2,
  topExports: [
    { good: 'Machinery and equipment', valueUsdBn: 21.8 },
    { good: 'Timber and wood products', valueUsdBn: 12.4 },
    { good: 'Food and drink', valueUsdBn: 11.9 },
    { good: 'Chemicals', valueUsdBn: 9.6 },
    { good: 'Textiles and clothing', valueUsdBn: 7.3 },
  ],
  topPartners: [
    { country: 'Nordmark', share: 18.4 },
    { country: 'Kestrel Union', share: 15.2 },
    { country: 'Southerland', share: 11.7 },
    { country: 'Ostara', share: 9.3 },
    { country: 'Tarnovia', share: 7.8 },
  ],
  govRevenuePctGdp: 38.2,
  govSpendingPctGdp: 39.1,
  govDebtPctGdp: 51.9,
  averageWageVcr: 4860,
  averageWageUsd: 1575,
  minimumWageVcr: 2140,
};

// Health, 2026.
export const HEALTH = {
  lifeExpectancyFemale: 81.8,
  lifeExpectancyMale: 77.1,
  infantMortalityPer1000: 3.4,
  doctorsPer1000: 3.9,
  nursesPer1000: 8.7,
  hospitalBedsPer1000: 4.6,
  healthSpendPctGdp: 8.4,
  healthSpendPerCapitaUsd: 2141,
  smokingAdultsPct: 16.2,
  obesityAdultsPct: 21.8,
  causesOfDeath: [
    { cause: 'Heart disease', share: 28.4 },
    { cause: 'Cancer', share: 24.1 },
    { cause: 'Stroke', share: 9.8 },
    { cause: 'Respiratory disease', share: 7.6 },
    { cause: 'Accidents', share: 4.9 },
    { cause: 'Diabetes', share: 3.7 },
    { cause: 'Other', share: 21.5 },
  ],
  source: 'Health Statistics 2026, VSO & Ministry of Health',
};

// Education, 2026.
export const EDUCATION = {
  literacyAdult: 98.7,
  literacyYouth: 99.6,
  enrolPrimary: 99.2,
  enrolSecondary: 96.8,
  enrolTertiary: 54.3,
  meanYearsSchooling: 12.4,
  pupilsPerTeacherPrimary: 16.2,
  pupilsPerTeacherSecondary: 13.8,
  spendPctGdp: 5.1,
  attainment: [
    { level: 'No formal schooling', share: 1.3 },
    { level: 'Primary', share: 14.2 },
    { level: 'Secondary', share: 46.8 },
    { level: 'Vocational', share: 12.4 },
    { level: 'University degree', share: 25.3 },
  ],
  source: 'Education Statistics 2026, VSO & Ministry of Education',
};

// Environment, 2026.
export const ENVIRONMENT = {
  co2PerCapitaTonnes: 4.8,
  renewablesShareElectricity: 46.2,
  forestCoverPct: 38.5,
  protectedLandPct: 17.9,
  recyclingRatePct: 52.0,
  airQualityGoodDays: 312,
  energyMix: [
    { source: 'Hydro', share: 24.6 },
    { source: 'Wind', share: 14.8 },
    { source: 'Solar', share: 6.8 },
    { source: 'Gas', share: 28.4 },
    { source: 'Coal', share: 12.1 },
    { source: 'Nuclear', share: 9.5 },
    { source: 'Other', share: 3.8 },
  ],
  source: 'Environment Statistics 2026, VSO & Ministry of Environment',
};

// Recent statistical releases, newest first.
export const RELEASES = [
  { date: '2026-11-24', title: 'Consumer prices, October 2026', topic: 'Prices', summary: 'Annual inflation eased to 2.3%, food prices up 1.9% on the year.' },
  { date: '2026-11-18', title: 'Labour Force Survey, October 2026', topic: 'Labour', summary: 'Unemployment fell to 4.1%; employment rose by 18,400 over the quarter.' },
  { date: '2026-11-12', title: 'National accounts, Q3 2026', topic: 'Economy', summary: 'GDP grew 0.4% on the quarter; services led growth at 0.7%.' },
  { date: '2026-11-05', title: 'Population estimates, mid-2026', topic: 'Population', summary: 'Population reached 8.42 million; net migration added 31,000 people.' },
  { date: '2026-10-28', title: 'Education statistics 2026', topic: 'Education', summary: 'Tertiary enrolment reached 54.3%; adult literacy 98.7%.' },
  { date: '2026-10-21', title: 'Health statistics 2026', topic: 'Health', summary: 'Life expectancy 79.4 years; hospital beds 4.6 per 1,000 people.' },
  { date: '2026-10-14', title: 'Environment statistics 2026', topic: 'Environment', summary: 'Renewables supplied 46.2% of electricity; emissions down 3.0%.' },
  { date: '2026-10-07', title: 'Regional accounts 2025', topic: 'Regions', summary: 'Alden remains the richest region at $31,240 per person; Gorran lowest at $17,290.' },
];

// Every indicator on the site, for the search box and the indicator index.
export const INDICATORS = [
  { name: 'Population', value: '8.42 million', page: '#/population', topic: 'Population' },
  { name: 'Population growth', value: '+0.66% a year', page: '#/population', topic: 'Population' },
  { name: 'Median age', value: '41.2 years', page: '#/population', topic: 'Population' },
  { name: 'Life expectancy', value: '79.4 years', page: '#/health', topic: 'Health' },
  { name: 'Infant mortality', value: '3.4 per 1,000 births', page: '#/health', topic: 'Health' },
  { name: 'Doctors per 1,000 people', value: '3.9', page: '#/health', topic: 'Health' },
  { name: 'Hospital beds per 1,000 people', value: '4.6', page: '#/health', topic: 'Health' },
  { name: 'GDP', value: '$214.6 billion', page: '#/economy', topic: 'Economy' },
  { name: 'GDP per person', value: '$25,487', page: '#/economy', topic: 'Economy' },
  { name: 'Unemployment', value: '4.1%', page: '#/economy', topic: 'Economy' },
  { name: 'Inflation (CPI)', value: '2.3%', page: '#/economy', topic: 'Economy' },
  { name: 'Exports', value: '$86.4 billion', page: '#/economy', topic: 'Economy' },
  { name: 'Government debt', value: '51.9% of GDP', page: '#/economy', topic: 'Economy' },
  { name: 'Average monthly wage', value: '₡4,860', page: '#/economy', topic: 'Economy' },
  { name: 'Adult literacy', value: '98.7%', page: '#/education', topic: 'Education' },
  { name: 'Tertiary enrolment', value: '54.3%', page: '#/education', topic: 'Education' },
  { name: 'Mean years of schooling', value: '12.4 years', page: '#/education', topic: 'Education' },
  { name: 'CO2 per person', value: '4.8 tonnes', page: '#/environment', topic: 'Environment' },
  { name: 'Renewable electricity', value: '46.2%', page: '#/environment', topic: 'Environment' },
  { name: 'Forest cover', value: '38.5% of land', page: '#/environment', topic: 'Environment' },
  { name: 'Recycling rate', value: '52.0%', page: '#/environment', topic: 'Environment' },
  { name: 'Largest region (Alden)', value: '2.14 million people', page: '#/regions', topic: 'Regions' },
  { name: 'Smallest region (Gorran)', value: '0.51 million people', page: '#/regions', topic: 'Regions' },
  { name: 'Urban population', value: '74.6%', page: '#/regions', topic: 'Regions' },
];

// --- Formatting helpers, shared by every view and chart. ---

export function fmtInt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function fmtMoneyUsd(n, digits = 0) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtPct(n, digits = 1) {
  return n.toFixed(digits) + '%';
}

// Format a headline value according to its declared format.
export function fmtHeadline(h) {
  if (h.format === 'people') return fmtInt(h.value);
  if (h.format === 'usd-bn') return '$' + h.value.toFixed(1) + 'bn';
  if (h.format === 'usd') return fmtMoneyUsd(h.value);
  if (h.format === 'percent') return fmtPct(h.value);
  if (h.format === 'years') return h.value.toFixed(1) + ' yrs';
  return String(h.value);
}

export function yearIndex(year) {
  return YEARS.indexOf(year);
}

export function valueAt(seriesName, year) {
  const i = yearIndex(year);
  return i === -1 ? null : SERIES[seriesName][i];
}
