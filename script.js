const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

const statsGrid = document.getElementById('statsGrid');
const emailsList = document.getElementById('emailsList');
const phonesList = document.getElementById('phonesList');
const urlsList = document.getElementById('urlsList');
const datesList = document.getElementById('datesList');

const SAMPLE_TEXT = `Hello Team,

Please contact me at john.doe@example.com or support@my-company.org.
My backup phone is +1 (555) 123-4567 and office line is 555-987-0000.
Visit https://example.com/docs and http://status.example.org for updates.
Project kickoff is on 04/15/2026 and final review will be on 2026-06-10.

Thanks!`;

const patterns = {
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  phones: /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g,
  urls: /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/g,
  dates: /\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/g,
};

function unique(matches) {
  return [...new Set(matches || [])];
}

function getStats(text, extracted) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r?\n/).length : 0;

  return [
    ['Characters', text.length],
    ['Words', words],
    ['Lines', lines],
    ['Emails', extracted.emails.length],
    ['Phones', extracted.phones.length],
    ['URLs', extracted.urls.length],
    ['Dates', extracted.dates.length],
    ['Text Status', text.trim() ? 'Detected' : 'No input'],
  ];
}

function renderStats(stats) {
  statsGrid.innerHTML = '';
  stats.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<div class="label">${label}</div><div class="value ${value === 'Detected' ? 'ok' : ''}">${value}</div>`;
    statsGrid.appendChild(card);
  });
}

function renderList(container, items) {
  container.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No items found';
    container.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function analyzeText() {
  const text = textInput.value;
  const extracted = {
    emails: unique(text.match(patterns.emails)),
    phones: unique(text.match(patterns.phones)),
    urls: unique(text.match(patterns.urls)),
    dates: unique(text.match(patterns.dates)),
  };

  renderStats(getStats(text, extracted));
  renderList(emailsList, extracted.emails);
  renderList(phonesList, extracted.phones);
  renderList(urlsList, extracted.urls);
  renderList(datesList, extracted.dates);
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  textInput.value = await file.text();
  analyzeText();
});

sampleBtn.addEventListener('click', () => {
  textInput.value = SAMPLE_TEXT;
  analyzeText();
});

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  analyzeText();
});

analyzeBtn.addEventListener('click', analyzeText);

analyzeText();
