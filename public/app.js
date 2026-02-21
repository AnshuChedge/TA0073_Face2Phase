/* ===== Face2Phase Shared JavaScript ===== */

// --- Question Bank ---
const QUESTIONS = {
  easy: {
    product: [
      "Tell me about yourself.",
      "Why do you want to work here?",
      "What are your strengths?",
      "Describe a time you worked in a team.",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
      "What motivates you?",
      "Tell me about a challenge you faced.",
      "How do you handle stress?",
      "What are your hobbies?"
    ],
    service: [
      "Tell me about yourself.",
      "Why are you interested in consulting?",
      "What is your greatest strength?",
      "Describe a project you are proud of.",
      "How do you prioritize tasks?",
      "What does teamwork mean to you?",
      "Tell me about a time you helped a client.",
      "How do you handle deadlines?",
      "What are your career goals?",
      "Why this company?"
    ]
  },
  medium: {
    product: [
      "Explain a complex technical concept to a non-technical person.",
      "How do you approach problem-solving?",
      "Describe a time you disagreed with your manager.",
      "Tell me about a product you improved.",
      "How do you handle competing priorities?",
      "Walk me through your design process.",
      "Describe a time you failed and what you learned.",
      "How do you stay updated with industry trends?",
      "Tell me about a data-driven decision you made.",
      "How would you handle a difficult stakeholder?"
    ],
    service: [
      "How do you manage client expectations?",
      "Describe a time you delivered under tight deadlines.",
      "Tell me about a cross-functional project.",
      "How do you approach ambiguous problems?",
      "Describe your experience with agile methodologies.",
      "Tell me about a time you had to influence without authority.",
      "How do you measure project success?",
      "Describe a conflict resolution experience.",
      "How do you handle scope creep?",
      "Tell me about a process you optimized."
    ]
  },
  hard: {
    product: [
      "Design a system to handle 10 million concurrent users.",
      "How would you turn around a failing product?",
      "Estimate the market size for electric vehicles in India.",
      "Describe how you would build a recommendation engine.",
      "Tell me about a time you made a decision with incomplete data.",
      "How would you prioritize features for a new product launch?",
      "Discuss the trade-offs between speed and quality.",
      "How do you handle ethical dilemmas in product decisions?",
      "Critique our product and suggest 3 improvements.",
      "How would you reduce churn by 20%?"
    ],
    service: [
      "A client's project is 3 months behind. What do you do?",
      "How would you restructure a failing consulting engagement?",
      "Estimate the revenue of Uber in your city.",
      "Describe a time you turned an unhappy client into a promoter.",
      "How would you approach digital transformation for a bank?",
      "Walk me through a strategic framework for market entry.",
      "How do you handle scope changes from a senior client?",
      "Discuss a time you challenged leadership and won.",
      "How would you price a new consulting service?",
      "Analyze the competitive landscape of cloud computing."
    ]
  }
};

const GD_TOPICS = [
  "Is artificial intelligence a threat to human employment?",
  "Should social media be regulated by the government?",
  "Is remote work the future of corporate culture?",
  "Can cryptocurrency replace traditional banking?",
  "Should college education be free for everyone?",
  "Is space exploration worth the investment?",
  "Should companies be held responsible for climate change?",
  "Is digital privacy a fundamental right?",
  "Can technology solve the global healthcare crisis?",
  "Should voting be made mandatory?"
];

const AI_PARTICIPANTS = [
  { name: "Anya", color: "#22c55e", avatar: "A", style: "analytical" },
  { name: "Rohan", color: "#06b6d4", avatar: "R", style: "assertive" },
  { name: "Priya", color: "#eab308", avatar: "P", style: "diplomatic" },
  { name: "Karan", color: "#f97316", avatar: "K", style: "creative" }
];

// --- Utility Functions ---
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function fluctuate(current, min, max, maxDelta) {
  const delta = (Math.random() - 0.5) * 2 * maxDelta;
  return clamp(current + delta, min, max);
}

function getScoreColor(score) {
  if (score >= 75) return 'var(--primary)';
  if (score >= 50) return 'var(--accent-yellow)';
  if (score >= 30) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 30) return 'Needs Work';
  return 'Poor';
}

// --- Session Storage Helpers ---
function saveSession(key, value) {
  sessionStorage.setItem('f2p_' + key, JSON.stringify(value));
}

function loadSession(key, fallback) {
  try {
    const val = sessionStorage.getItem('f2p_' + key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function getQuestions() {
  const difficulty = loadSession('difficulty', 'medium');
  const company = loadSession('company', 'product');
  return QUESTIONS[difficulty]?.[company] || QUESTIONS.medium.product;
}

function getRandomGDTopic() {
  return GD_TOPICS[randomBetween(0, GD_TOPICS.length - 1)];
}

// --- Generate Report Data ---
function generateReportData() {
  return {
    overall: randomBetween(62, 88),
    scores: {
      bodyLanguage: randomBetween(55, 92),
      facialEmotion: randomBetween(50, 90),
      fearStress: randomBetween(20, 75),
      emotionStability: randomBetween(55, 88),
      speechClarity: randomBetween(60, 95),
      confidence: randomBetween(50, 90),
      answerQuality: randomBetween(55, 90),
      engagement: randomBetween(60, 92)
    },
    emotionTimeline: Array.from({ length: 12 }, (_, i) => ({
      time: i * 0.5,
      confidence: randomBetween(40, 90),
      nervousness: randomBetween(10, 60),
      fear: randomBetween(5, 50),
      calmness: randomBetween(30, 80)
    })),
    fearTriggers: [
      { time: '1:23', question: 'Describe a time you failed', severity: randomBetween(60, 95) },
      { time: '3:45', question: 'Critique our product', severity: randomBetween(50, 85) },
      { time: '5:12', question: 'Handle ethical dilemmas', severity: randomBetween(40, 75) }
    ],
    strengths: [
      'Maintained consistent eye contact throughout the session',
      'Clear and confident vocal delivery',
      'Structured and logical answer format',
      'Good posture and body composure'
    ],
    weaknesses: [
      'Elevated stress during technical questions',
      'Occasional filler words detected (um, uh)',
      'Micro-expression leakage during pressure moments',
      'Slight fidgeting when discussing failures'
    ],
    suggestions: [
      'Practice breathing exercises before high-pressure questions',
      'Record yourself answering behavioral questions to identify filler words',
      'Work on maintaining facial composure during unexpected questions',
      'Use the STAR method consistently for behavioral answers',
      'Practice power poses to reduce physiological stress response'
    ]
  };
}

// --- Canvas Chart Helpers ---
function drawRadarChart(canvas, data, labels) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = w / 2, ch = h / 2;
  const cx = cw / 2, cy = ch / 2;
  const r = Math.min(cx, cy) - 30;
  const n = labels.length;
  const angleStep = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, cw, ch);

  // Grid circles
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (r / 4) * i, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Grid lines
  for (let i = 0; i < n; i++) {
    const angle = angleStep * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const val = (data[i] / 100) * r;
    const x = cx + Math.cos(angle) * val;
    const y = cy + Math.sin(angle) * val;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(34,197,94,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points + labels
  for (let i = 0; i < n; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const val = (data[i] / 100) * r;
    const x = cx + Math.cos(angle) * val;
    const y = cy + Math.sin(angle) * val;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    const lx = cx + Math.cos(angle) * (r + 18);
    const ly = cy + Math.sin(angle) * (r + 18);
    ctx.fillStyle = '#8888a8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], lx, ly);
  }
}

function drawBarChart(canvas, data, labels, colors) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = w / 2, ch = h / 2;
  const padding = { top: 10, right: 20, bottom: 10, left: 110 };
  const chartW = cw - padding.left - padding.right;
  const chartH = ch - padding.top - padding.bottom;
  const barH = Math.min(24, chartH / labels.length - 8);
  const gap = (chartH - barH * labels.length) / (labels.length + 1);

  ctx.clearRect(0, 0, cw, ch);

  labels.forEach((label, i) => {
    const y = padding.top + gap + i * (barH + gap);
    const barW = (data[i] / 100) * chartW;

    // Background bar
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.roundRect(padding.left, y, chartW, barH, 4);
    ctx.fill();

    // Value bar
    ctx.fillStyle = colors[i] || '#22c55e';
    ctx.beginPath();
    ctx.roundRect(padding.left, y, barW, barH, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = '#8888a8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, padding.left - 8, y + barH / 2);

    // Value text
    ctx.fillStyle = '#f0f0f5';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(data[i] + '%', padding.left + barW + 6, y + barH / 2);
  });
}

function drawLineChart(canvas, datasets, timeLabels) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = w / 2, ch = h / 2;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = cw - pad.left - pad.right;
  const chartH = ch - pad.top - pad.bottom;

  ctx.clearRect(0, 0, cw, ch);

  // Grid
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#555570';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((100 - 25 * i) + '', pad.left - 6, y + 3);
  }

  // Time labels
  const n = timeLabels.length;
  timeLabels.forEach((label, i) => {
    const x = pad.left + (chartW / (n - 1)) * i;
    ctx.fillStyle = '#555570';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, ch - 8);
  });

  // Lines
  const lineColors = ['#22c55e', '#ef4444', '#eab308', '#06b6d4'];
  datasets.forEach((ds, di) => {
    ctx.beginPath();
    ds.forEach((val, i) => {
      const x = pad.left + (chartW / (n - 1)) * i;
      const y = pad.top + chartH - (val / 100) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColors[di] || '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    ds.forEach((val, i) => {
      const x = pad.left + (chartW / (n - 1)) * i;
      const y = pad.top + chartH - (val / 100) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = lineColors[di] || '#22c55e';
      ctx.fill();
    });
  });
}

function drawHeatMap(canvas, rows, cols) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = w / 2, ch = h / 2;
  const cellW = cw / cols;
  const cellH = ch / rows;

  ctx.clearRect(0, 0, cw, ch);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const intensity = Math.random();
      const red = Math.floor(intensity * 239);
      const green = Math.floor((1 - intensity) * 100 + 30);
      ctx.fillStyle = `rgba(${red}, ${green}, 50, ${0.3 + intensity * 0.7})`;
      ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
    }
  }
}

function drawAreaChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = w / 2, ch = h / 2;
  const pad = { top: 15, right: 15, bottom: 15, left: 35 };
  const chartW = cw - pad.left - pad.right;
  const chartH = ch - pad.top - pad.bottom;
  const n = data.length;

  ctx.clearRect(0, 0, cw, ch);

  // Grid
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.stroke();
  }

  // Area fill
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  data.forEach((val, i) => {
    const x = pad.left + (chartW / (n - 1)) * i;
    const y = pad.top + chartH - (val / 100) * chartH;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, 'rgba(34,197,94,0.3)');
  grad.addColorStop(1, 'rgba(34,197,94,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + (chartW / (n - 1)) * i;
    const y = pad.top + chartH - (val / 100) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// --- Webcam Helper ---
async function initWebcam(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    videoElement.srcObject = stream;
    videoElement.play();
    return true;
  } catch (err) {
    console.warn('Webcam not available:', err.message);
    return false;
  }
}

// --- Fear Gauge Drawing ---
function drawFearGauge(canvas, score) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width = canvas.height = 120 * 2;
  ctx.scale(2, 2);
  const cx = 60, cy = 60, r = 48;
  const startAngle = 0.75 * Math.PI;
  const endAngle = 2.25 * Math.PI;
  const totalArc = endAngle - startAngle;
  const scoreAngle = startAngle + (score / 100) * totalArc;

  ctx.clearRect(0, 0, 120, 120);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Score arc
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#eab308' : '#22c55e';
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, scoreAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();
}
