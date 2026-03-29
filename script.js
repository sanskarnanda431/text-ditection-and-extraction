const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputText = document.getElementById('outputText');
const statusMsg = document.getElementById('statusMsg');
const stats = document.getElementById('stats');

let loadedText = '';

function setStatus(message) {
  statusMsg.textContent = message;
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function updateStats(text) {
  const characters = text.length;
  const words = countWords(text);
  const lines = text ? text.split(/\r?\n/).length : 0;

  stats.innerHTML = '';
  ['Characters: ' + characters, 'Words: ' + words, 'Lines: ' + lines].forEach((item) => {
    const tag = document.createElement('span');
    tag.textContent = item;
    stats.appendChild(tag);
  });
}

function handleFile(file) {
  if (!file) {
    setStatus('No file selected.');
    return;
  }

  if (!file.type.includes('text') && !file.name.toLowerCase().endsWith('.txt')) {
    setStatus('Please upload a .txt file for this demo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    loadedText = String(reader.result || '');
    setStatus(`Loaded: ${file.name}`);
    updateStats(loadedText);
  };
  reader.onerror = () => setStatus('Could not read this file.');
  reader.readAsText(file);
}

extractBtn.addEventListener('click', () => {
  if (!loadedText.trim()) {
    setStatus('Upload a text file first.');
    outputText.value = '';
    updateStats('');
    return;
  }

  outputText.value = loadedText;
  setStatus('Text extracted successfully.');
  updateStats(loadedText);
});

copyBtn.addEventListener('click', async () => {
  const text = outputText.value.trim();
  if (!text) {
    setStatus('Nothing to copy yet.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard.');
  } catch {
    setStatus('Clipboard not available in this browser/session.');
  }
});

downloadBtn.addEventListener('click', () => {
  const text = outputText.value;
  if (!text.trim()) {
    setStatus('Nothing to download yet.');
    return;
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'extracted-text.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus('Downloaded extracted text.');
});

fileInput.addEventListener('change', (event) => {
  handleFile(event.target.files?.[0]);
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
  });
});

dropZone.addEventListener('drop', (event) => {
  const file = event.dataTransfer?.files?.[0];
  handleFile(file);
});

updateStats('');
setStatus('Ready. Upload a .txt file to begin.');
