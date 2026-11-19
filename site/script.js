/* ─────────────────────────────────────────────────────────────
   Project data. Edit text/links here — the sheets render from it.
   Diagram nodes: x, y (top-left), w/h optional, k = 'ai' | 'det' | 'db'
   Edges: [from, to, { fb: fallback, l: label, v: force vertical routing }]
   ───────────────────────────────────────────────────────────── */
const W = 112, H = 46;

const PRIMARY = [
  {
    title: 'HelioFlow',
    shots: [
      ['helio-home', 'Homeowner landing page'],
      ['helio-sales', 'Sales workspace — next action per lead'],
      ['helio-mobile', 'Private status link on a phone'],
      ['helio-hindi', 'Eligibility form in Hindi', 'हिन्दी & मराठी too!'],
    ],
    scribble: 'start here: my favourite build',
    pitch: 'Lead-to-installation platform for a rooftop solar installer in Nagpur. A homeowner photographs an electricity bill; the system reads it, scores the lead, sizes the system and produces a same-day quote with subsidy and payback.',
    links: [['Live demo', 'https://helio-flow-nine.vercel.app/'], ['Code', 'https://github.com/AMit090912/HelioFlow']],
    facts: [['~400', 'backend tests on real Postgres'], ['3', 'languages — EN · हिन्दी · मराठी'], ['3-tier', 'AI fallback chain']],
    stack: ['FastAPI', 'SQLAlchemy 2', 'Alembic', 'PostgreSQL', 'Next.js', 'Groq vision', 'Gemini', 'Playwright', 'GitHub Actions'],
    notes: [
      'Photos are checked for size, darkness and blur <b>before</b> any AI call. Groq reads the bill, Gemini is the fallback, manual entry the last resort — a lead is never lost.',
      'Every value is range-checked and cross-checked; doubtful fields are flagged and the homeowner confirms each number before it is used.',
      '<b>The AI never does the maths.</b> Scoring, sizing, pricing, subsidy and payback are plain Python <code>Decimal</code>, tested against the brief’s sample leads.',
      'A sent quote is an immutable snapshot of that day’s rules, guarded by a database trigger.',
    ],
    note: 'Free hosting — the first visit may take up to a minute to wake the server.',
    dg: {
      w: 720, h: 290,
      nodes: {
        bill: { x: 10, y: 30, t: 'Bill photo', s: 'upload' },
        qc: { x: 150, y: 30, t: 'Quality gate', s: 'blur · light', k: 'det' },
        groq: { x: 290, y: 30, t: 'Groq vision', s: 'read the bill', k: 'ai', n: 1 },
        gem: { x: 290, y: 130, t: 'Gemini Flash', s: 'fallback', k: 'ai' },
        man: { x: 290, y: 225, t: 'Manual entry', s: 'last resort' },
        ok: { x: 430, y: 30, t: 'Owner confirms', s: 'flagged fields', n: 2 },
        calc: { x: 580, y: 30, w: 126, t: 'Decimal engine', s: 'score·size·price', k: 'det', n: 3 },
        quote: { x: 580, y: 130, w: 126, t: 'Quote snapshot', s: 'immutable', k: 'db', n: 4 },
        link: { x: 580, y: 225, w: 126, t: 'Status link', s: 'hashed token' },
      },
      edges: [
        ['bill', 'qc'], ['qc', 'groq'], ['groq', 'ok'], ['ok', 'calc'], ['calc', 'quote'], ['quote', 'link'],
        ['groq', 'gem', { fb: 1, l: 'fails' }], ['gem', 'man', { fb: 1, l: 'fails' }],
        ['gem', 'ok', { fb: 1 }], ['man', 'ok', { fb: 1 }],
      ],
    },
  },
  {
    title: 'AI Support Ticket Platform',
    shots: [
      ['support-ticket', 'Ticket view with the AI-drafted reply', 'the AI draft, agents only'],
      ['support-queue', 'Agent queue — search, filter, stats'],
      ['support-login', 'Sign-in'],
    ],
    pitch: 'Customers raise and track tickets; agents triage, assign and resolve them. On creation an LLM suggests the category, priority and a reply draft — but the platform never depends on it.',
    links: [['Live demo', 'https://ticket-tau.vercel.app/login'], ['API docs', 'https://ai-powered-support-ticket-platform.onrender.com/docs'], ['Code', 'https://github.com/AMit090912/AI-Powered-Support-Ticket-Platform']],
    facts: [['53', 'tests — 29 unit, 24 integration'], ['2', 'portals: customer & agent'], ['0', 'tickets blocked by AI failure']],
    stack: ['FastAPI', 'SQLAlchemy', 'MySQL', 'JWT', 'React', 'React Query', 'Gemini', 'Render', 'Vercel'],
    notes: [
      'JWT bearer tokens with <b>customer</b> / <b>agent</b> roles. Customers only ever see their own tickets.',
      'On creation, Gemini returns category, priority and a suggested reply — shown to agents only.',
      'No key, timeout or malformed JSON → a deterministic rule-based provider takes over. Ticket creation never waits on the model.',
      'Layered Routers → Services → Repositories, with a per-ticket audit trail and agent analytics.',
    ],
    note: 'Demo login: agent@demo.com / password123 (or customer@demo.com). The API sleeps on free tier — first request can take ~30s.',
    dg: {
      w: 720, h: 290,
      nodes: {
        spa: { x: 10, y: 30, t: 'React SPA', s: '2 portals' },
        jwt: { x: 150, y: 30, t: 'JWT · RBAC', s: 'customer / agent', k: 'det', n: 1 },
        rt: { x: 290, y: 30, t: 'Routers', s: 'FastAPI' },
        sv: { x: 430, y: 30, t: 'Services', s: 'business rules' },
        repo: { x: 580, y: 30, w: 126, t: 'Repositories', s: 'SQLAlchemy', n: 4 },
        db: { x: 580, y: 130, w: 126, t: 'MySQL', s: 'Aiven', k: 'db' },
        gem: { x: 430, y: 130, t: 'Gemini triage', s: 'auto-triage', k: 'ai', n: 2 },
        rule: { x: 430, y: 225, t: 'Rule-based', s: 'fallback', k: 'det', n: 3 },
      },
      edges: [
        ['spa', 'jwt'], ['jwt', 'rt'], ['rt', 'sv'], ['sv', 'repo'], ['repo', 'db'],
        ['sv', 'gem', { l: 'on create' }], ['gem', 'rule', { fb: 1, l: 'no key / timeout' }],
      ],
    },
  },
  {
    title: 'VedaAI',
    shots: [
      ['veda-highlights', 'Answers mapped and highlighted on the handwriting', 'ink-snapped boxes, not model guesses'],
      ['veda-upload', 'Upload a question paper and answer sheets'],
    ],
    pitch: 'A teacher uploads a question paper and a student’s handwritten answer sheet. VedaAI extracts the questions, transcribes the answers, maps each one to its question, grades it, and highlights it on the page it was written on.',
    links: [['Live demo', 'https://veda-ai-z218.vercel.app/']],
    facts: [['495', 'automated tests'], ['0', 'LLM calls on fully labelled sheets'], ['SSE', 'live progress streaming']],
    stack: ['FastAPI', 'Next.js 16', 'React 19', 'Gemini API', 'Claude API', 'Server-Sent Events', 'Docker'],
    notes: [
      'Provider-agnostic: Gemini or Claude behind one interface, switched by a single env var.',
      'Highlights are rebuilt from the page’s <b>own ink</b>, not from the model’s drifting boxes — a deterministic grounding step guarded by 495 tests.',
      'Labelled answers are matched to questions deterministically first; the LLM only sees what’s left. Fewer tokens, lower latency.',
      'Each stage reports progress over Server-Sent Events to the Next.js client.',
    ],
    dg: {
      w: 720, h: 270,
      groups: [{ x: 2, y: 8, w: 716, h: 112, l: 'FastAPI · job pipeline' }],
      nodes: {
        ing: { x: 12, y: 46, w: 100, t: 'Ingest', s: 'PDF → pages' },
        q: { x: 130, y: 46, w: 100, t: 'Questions', s: 'extract', k: 'ai', n: 1 },
        a: { x: 248, y: 46, w: 100, t: 'Answers', s: 'transcribe', k: 'ai' },
        ink: { x: 366, y: 46, w: 100, t: 'Ink snap', s: 'ground boxes', k: 'det', n: 2 },
        map: { x: 484, y: 46, w: 100, t: 'Map', s: 'labels first', k: 'det', n: 3 },
        gr: { x: 602, y: 46, w: 100, t: 'Grade', s: 'score', k: 'ai' },
        web: { x: 250, y: 196, w: 220, t: 'Next.js client', s: 'upload · progress · highlights' },
        llm: { x: 560, y: 196, w: 142, t: 'LLM fallback', s: 'unlabelled only', k: 'ai' },
      },
      edges: [
        ['ing', 'q'], ['q', 'a'], ['a', 'ink'], ['ink', 'map'], ['map', 'gr'],
        ['map', 'llm', { fb: 1, v: 1, l: 'no label' }],
      ],
      raw: [{ pts: [[360, 120], [360, 196]], l: 'SSE progress', n: 4, lx: 368 }],
    },
  },
  {
    title: 'Healthcare RAG Assistant',
    shots: [
      ['health-chat', 'Grounded answers from uploaded discharge summaries'],
      ['health-upload', 'Local knowledge base, empty state'],
    ],
    pitch: 'A privacy-first clinical assistant that answers questions only from a hospital’s own SOPs and guidelines. Embeddings, vector store and the model all run on the device — nothing leaves the machine.',
    links: [['Video demo', 'https://www.loom.com/share/f660d3132cdb4d9aad51fcb339b1794b'], ['Code', 'https://github.com/AMit090912/HealthCare-RAG-ChatBot']],
    facts: [['0', 'cloud calls'], ['top-4', 'chunks retrieved per query'], ['token', 'by-token streaming']],
    stack: ['FastAPI', 'LangChain', 'ChromaDB', 'Ollama · qwen2.5', 'MiniLM embeddings', 'PyMuPDF', 'Next.js'],
    notes: [
      'PDFs and CSVs are chunked (1000 / 200 overlap), embedded locally with MiniLM and persisted in ChromaDB.',
      'A history-aware retriever rewrites follow-ups — “what about children?” — into standalone queries.',
      'Answers stream from qwen2.5 via Ollama under a strict answer-only-from-context prompt.',
      'If the documents don’t support an answer, it says so instead of guessing.',
    ],
    dg: {
      w: 720, h: 290,
      groups: [{ x: 2, y: 8, w: 716, h: 274, l: 'On-device boundary · no network egress' }],
      nodes: {
        doc: { x: 20, y: 44, t: 'PDF / CSV', s: 'SOPs, guidelines' },
        ch: { x: 160, y: 44, t: 'Chunk', s: '1000 / 200' },
        em: { x: 300, y: 44, t: 'Embed', s: 'MiniLM-L6', k: 'ai' },
        vdb: { x: 440, y: 44, t: 'ChromaDB', s: 'persistent', k: 'db', n: 1 },
        ask: { x: 20, y: 196, t: 'Question', s: '+ chat history' },
        rw: { x: 160, y: 196, t: 'Rewrite', s: 'history-aware', k: 'ai', n: 2 },
        ret: { x: 300, y: 196, t: 'Retrieve', s: 'top-4 chunks' },
        llm: { x: 440, y: 196, t: 'qwen2.5 · Ollama', s: 'context-only', k: 'ai', n: 3 },
        out: { x: 590, y: 196, w: 116, t: 'Stream', s: 'markdown' },
        no: { x: 590, y: 110, w: 116, t: 'Refuse', s: '“not in docs”', k: 'det', n: 4 },
      },
      edges: [
        ['doc', 'ch'], ['ch', 'em'], ['em', 'vdb'],
        ['ask', 'rw'], ['rw', 'ret'], ['ret', 'llm'], ['llm', 'out'],
        ['vdb', 'ret', { v: 1 }], ['llm', 'no', { fb: 1, l: 'unsupported' }],
      ],
    },
  },
];

const SECONDARY = [
  {
    title: 'SimWorld',
    shots: [['simworld', 'Workspace — a logistics run on the city grid']],
    pitch: 'An evaluation lab for AI agents. Agents act inside deterministic simulations — city logistics and traffic control — and the engine, not the agent, decides what actually happened.',
    links: [['Video', 'https://drive.google.com/file/d/19oCWTagrqVmLvW3SiMF4-ZbLl_wJFdwj/view?usp=sharing'], ['Code', 'https://github.com/AMit090912/SimWorld']],
    stack: ['FastAPI', 'React', 'HTTP agent protocol', 'MCP', 'Docker'],
    notes: [
      'The engine validates movement, fuel, closures and deadlines before any state change; illegal actions cost a tick.',
      'Every step stores a state hash — same seed + same actions = same hash. Runs are replayable evidence.',
    ],
    dg: {
      w: 560, h: 250,
      nodes: {
        ag: { x: 10, y: 100, t: 'Agent', s: 'any agent', k: 'ai' },
        sc: { x: 150, y: 100, t: 'Schema check', s: 'one action' },
        en: { x: 290, y: 100, t: 'Engine rules', s: 'authority', k: 'det', n: 1 },
        tr: { x: 430, y: 100, t: 'Transition', s: 'new state' },
        rej: { x: 290, y: 10, t: 'Rejected', s: 'tick consumed' },
        snap: { x: 430, y: 194, t: 'Snapshot', s: 'state hash', k: 'db', n: 2 },
      },
      edges: [['ag', 'sc'], ['sc', 'en'], ['en', 'tr'], ['tr', 'snap'], ['en', 'rej', { fb: 1 }]],
      raw: [{ pts: [[430, 217], [66, 217], [66, 146]], l: 'next observation', lx: 190, ly: 211 }],
    },
  },
  {
    title: 'AI Fashion Stylist',
    shots: [['fashion-outfit', 'A suggested outfit, with the stylist’s reasoning']],
    pitch: 'A conversational stylist agent that assembles a complete, compatible outfit from a real catalog using image and text embeddings — and explains why it works.',
    links: [['Live demo', 'https://huggingface.co/spaces/Amit6576/ai-fashion-stylist'], ['Video', 'https://www.loom.com/share/ed5b041c7e174d79aa600ac06c756059'], ['Code', 'https://github.com/AMit090912/AI-Fashion-Outfit-Recommendation-System']],
    stack: ['Python', 'FashionCLIP', 'FAISS', 'Gemini tools', 'Streamlit', '44 tests'],
    notes: [
      'With a key, a tool-calling Gemini agent; without one (or when rate-limited), a rule-based parser with the same conversation state.',
      'A 4-signal compatibility score picks items; every item is a real catalog row — the LLM never invents products.',
    ],
    dg: {
      w: 560, h: 200,
      nodes: {
        rq: { x: 10, y: 20, t: 'Request', s: '“dinner date”' },
        ag: { x: 150, y: 20, t: 'Stylist agent', s: 'Gemini tools', k: 'ai', n: 1 },
        rec: { x: 290, y: 20, t: 'Recommender', s: '4-signal score', k: 'det', n: 2 },
        out: { x: 430, y: 20, t: 'Outfit + why', s: 'grounded' },
        rule: { x: 150, y: 130, t: 'Rule parser', s: 'no key / 429', k: 'det' },
        rag: { x: 290, y: 130, t: 'Curated RAG', s: '25 outfits', k: 'db' },
        clip: { x: 430, y: 130, t: 'CLIP + FAISS', s: 'image + text', k: 'ai' },
      },
      edges: [['rq', 'ag'], ['ag', 'rec'], ['rec', 'out'], ['ag', 'rule', { fb: 1 }], ['rule', 'rag', { fb: 1 }], ['rec', 'rag'], ['rec', 'clip', { v: 1 }]],
    },
  },
  {
    title: 'AI Memory Chatbot',
    shots: [['chatbot', 'It remembers your name across turns']],
    pitch: 'A full-stack chatbot that remembers the conversation, with history persisted to a serverless MySQL database and fast inference on Groq.',
    links: [['Live demo', 'https://ai-chat-bot-xi-ten-70.vercel.app/'], ['Code', 'https://github.com/AMit090912/AI-Chat-Bot']],
    stack: ['FastAPI', 'LangChain', 'Groq · qwen3-32b', 'TiDB', 'Next.js'],
    notes: ['Chat history is stored in TiDB; if the database goes offline the API falls back to in-memory history and keeps chatting.'],
    dg: {
      w: 560, h: 190,
      nodes: {
        ui: { x: 10, y: 20, t: 'Next.js', s: 'chat UI' },
        api: { x: 150, y: 20, t: 'FastAPI', s: 'session' },
        llm: { x: 290, y: 20, t: 'LangChain', s: 'Groq inference', k: 'ai' },
        db: { x: 150, y: 120, t: 'TiDB', s: 'chat history', k: 'db', n: 1 },
        mem: { x: 290, y: 120, t: 'In-memory', s: 'if DB offline', k: 'det' },
      },
      edges: [['ui', 'api'], ['api', 'llm'], ['api', 'db'], ['db', 'mem', { fb: 1 }]],
    },
  },
  {
    title: 'Transaction Processing Pipeline',
    pitch: 'Ingests a dirty transactions CSV, processes it asynchronously, classifies and flags anomalies with an LLM, and serves results over a polling API. One <code>docker compose up</code>, no keys required.',
    links: [['Video', 'https://1drv.ms/v/c/8cfd3edcb7cbbffa/IQDD0-EGd9DGSb0O6LOKSuRKAdk6Dj1V27wqfWjZ2ZYYsRI?e=ZYynt4'], ['Code', 'https://github.com/AMit090912/AI-Powered-Transaction-Processing-Pipeline-']],
    stack: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Groq', 'Docker'],
    notes: [
      'Upload returns <b>202 + job_id</b> immediately; the client polls status and results.',
      'LLM calls are batched and retried 3× with backoff; on exhaustion the batch is marked and the job still completes.',
    ],
    dg: {
      w: 560, h: 270,
      nodes: {
        up: { x: 10, y: 20, t: 'CSV upload', s: 'validate' },
        api: { x: 150, y: 20, t: 'FastAPI', s: '202 + job_id', n: 1 },
        q: { x: 290, y: 20, t: 'Redis', s: 'broker', k: 'db' },
        wk: { x: 430, y: 20, t: 'Celery worker', s: 'clean · detect' },
        llm: { x: 430, y: 120, t: 'Groq LLM', s: 'batched', k: 'ai', n: 2 },
        det: { x: 430, y: 210, t: 'Deterministic', s: 'offline engine', k: 'det' },
        pg: { x: 150, y: 120, t: 'PostgreSQL', s: 'results', k: 'db' },
        poll: { x: 10, y: 120, t: 'Poll API', s: 'status · results' },
      },
      edges: [['up', 'api'], ['api', 'q'], ['q', 'wk'], ['wk', 'llm'], ['llm', 'det', { fb: 1, l: '3× retry' }], ['wk', 'pg', { v: 1 }], ['pg', 'poll']],
    },
  },
  {
    title: 'Task Automation Agent',
    pitch: 'Takes a plain-English instruction, breaks it into steps, picks the right tools and runs the workflow — with state persisted between steps.',
    links: [['Code', 'https://github.com/AMit090912/Task-Automation-AI-Agent-']],
    stack: ['FastAPI', 'Claude API', 'SQLite', 'Tool calling'],
    notes: ['Claude plans and decomposes the instruction into tool calls.', 'Workflow state is persisted in SQLite / JSON so multi-step runs can be inspected.'],
    dg: {
      w: 560, h: 190,
      nodes: {
        in: { x: 10, y: 20, t: 'Instruction', s: 'plain English' },
        pl: { x: 150, y: 20, t: 'Claude planner', s: 'reasoning', k: 'ai', n: 1 },
        dc: { x: 290, y: 20, t: 'Decompose', s: 'sub-tasks' },
        tl: { x: 430, y: 20, t: 'Tool select', s: 'registry' },
        ex: { x: 430, y: 120, t: 'Execute', s: 'pipeline', k: 'det' },
        st: { x: 290, y: 120, t: 'State', s: 'SQLite / JSON', k: 'db', n: 2 },
      },
      edges: [['in', 'pl'], ['pl', 'dc'], ['dc', 'tl'], ['tl', 'ex'], ['ex', 'st']],
    },
  },
  {
    title: 'Inclusive Connect',
    pitch: 'A computer-vision app that helps deaf and mute people communicate. It recognises hand gestures from a webcam in real time and turns them into text, including inside Google Meet calls.',
    links: [['Code', 'https://github.com/AMit090912/inclusive-connect']],
    stack: ['Python', 'OpenCV', 'cvzone', 'Keras', 'PyAutoGUI'],
    notes: [
      'cvzone’s HandDetector finds and crops the hand in every OpenCV frame.',
      'A Keras model I trained classifies 7 gestures: Hello, I Love You, No, Okay, Please, Thank You and Yes.',
      'Recognised gestures are typed into Google Meet, so signers can join virtual meetings.',
    ],
    dg: {
      w: 560, h: 190,
      nodes: {
        cam: { x: 10, y: 20, t: 'Webcam', s: 'OpenCV frames' },
        hd: { x: 150, y: 20, t: 'HandDetector', s: 'cvzone · crop', n: 1 },
        md: { x: 290, y: 20, t: 'Keras model', s: '7 gestures', k: 'ai', n: 2 },
        tx: { x: 430, y: 20, t: 'Text caption', s: 'on screen' },
        meet: { x: 430, y: 120, t: 'Google Meet', s: 'PyAutoGUI', n: 3 },
      },
      edges: [['cam', 'hd'], ['hd', 'md'], ['md', 'tx'], ['tx', 'meet']],
    },
  },
];

/* ───────── SVG diagram renderer ───────── */
const NS = 'http://www.w3.org/2000/svg';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function box(n) { return { ...n, w: n.w || W, h: n.h || H }; }

function route(a, b, o = {}) {
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
  if (!o.v && b.x >= a.x + a.w - 1) {
    const s = [a.x + a.w, acy], e = [b.x, bcy];
    if (Math.abs(s[1] - e[1]) < 2) return [s, e];
    const mx = (s[0] + e[0]) / 2; return [s, [mx, s[1]], [mx, e[1]], e];
  }
  if (!o.v && b.x + b.w <= a.x + 1) {
    const s = [a.x, acy], e = [b.x + b.w, bcy];
    if (Math.abs(s[1] - e[1]) < 2) return [s, e];
    const mx = (s[0] + e[0]) / 2; return [s, [mx, s[1]], [mx, e[1]], e];
  }
  const down = bcy > acy;
  const s = [acx, down ? a.y + a.h : a.y], e = [bcx, down ? b.y : b.y + b.h];
  if (Math.abs(s[0] - e[0]) < 2) return [s, [s[0], e[1]]];
  const my = (s[1] + e[1]) / 2; return [s, [s[0], my], [e[0], my], e];
}

function arrowHead(p, q, fb) {
  const ang = Math.atan2(q[1] - p[1], q[0] - p[0]), L = 8, Wd = 4;
  const [x, y] = q;
  const p1 = [x - L * Math.cos(ang) + Wd * Math.sin(ang), y - L * Math.sin(ang) - Wd * Math.cos(ang)];
  const p2 = [x - L * Math.cos(ang) - Wd * Math.sin(ang), y - L * Math.sin(ang) + Wd * Math.cos(ang)];
  return `<path class="arrow${fb ? ' fb' : ''}" d="M${x},${y}L${p1}L${p2}Z"/>`;
}

function longestSeg(pts) {
  let best = [pts[0], pts[1]], len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    if (l > len) { len = l; best = [pts[i], pts[i + 1]]; }
  }
  return best;
}

function edgeSvg(pts, o, i) {
  const d = 'M' + pts.map(p => p.join(',')).join('L');
  let len = 0; for (let k = 0; k < pts.length - 1; k++) len += Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]);
  const delay = `--d:${(0.15 + i * 0.12).toFixed(2)}s`;
  let out = `<path class="ed${o.fb ? ' fb' : ''}" d="${d}" style="--len:${Math.ceil(len)};${delay}"/>`;
  if (!o.fb) out += `<path class="flow" d="${d}"/>`;
  out += `<g class="el-wrap" style="${delay}">` + arrowHead(pts[pts.length - 2], pts[pts.length - 1], o.fb) + '</g>';
  if (o.l) {
    const [p, q] = longestSeg(pts);
    const horiz = Math.abs(p[1] - q[1]) < 1;
    const lx = o.lx ?? (horiz ? (p[0] + q[0]) / 2 : p[0] + 7);
    const ly = o.ly ?? (horiz ? p[1] - 7 : (p[1] + q[1]) / 2 + 4);
    out += `<text class="el${o.fb ? ' fb' : ''}" x="${lx}" y="${ly}" text-anchor="${horiz && o.lx == null ? 'middle' : 'start'}" style="${delay}">${esc(o.l)}</text>`;
  }
  return out;
}

function balloon(x, y, n, i) {
  return `<g class="bal" data-n="${n}" style="--d:${(0.4 + i * 0.1).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y + 4}" text-anchor="middle">${n}</text></g>`;
}

function renderDiagram(dg, label) {
  const nodes = {};
  for (const [id, n] of Object.entries(dg.nodes)) nodes[id] = box(n);
  let g = '';
  (dg.groups || []).forEach(gr => {
    g += `<rect class="grp" x="${gr.x}" y="${gr.y}" width="${gr.w}" height="${gr.h}" rx="4"/>`;
    g += `<text class="grp-l" x="${gr.x + 10}" y="${gr.y + 18}">${esc(gr.l)}</text>`;
  });
  let i = 0;
  dg.edges.forEach(([a, b, o = {}]) => { g += edgeSvg(route(nodes[a], nodes[b], o), o, i++); });
  (dg.raw || []).forEach(r => {
    g += edgeSvg(r.pts, { l: r.l, lx: r.lx, ly: r.ly }, i++);
    if (r.n) g += balloon(r.pts[0][0] - 14, (r.pts[0][1] + r.pts[1][1]) / 2, r.n, i);
  });
  let j = 0;
  for (const [id, n] of Object.entries(nodes)) {
    const delay = `--d:${(j++ * 0.07).toFixed(2)}s`;
    const cls = `nd ${n.k || ''}`;
    let shape;
    if (n.k === 'db') {
      const r = 6;
      shape = `<path class="cyl" d="M${n.x},${n.y + r} a${n.w / 2},${r} 0 0 1 ${n.w},0 v${n.h - 2 * r} a${n.w / 2},${r} 0 0 1 ${-n.w},0 Z M${n.x},${n.y + r} a${n.w / 2},${r} 0 0 0 ${n.w},0"/>`;
    } else {
      shape = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="2"/>`;
    }
    const cx = n.x + n.w / 2, ty = n.y + (n.s ? n.h / 2 - 2 : n.h / 2 + 4);
    g += `<g class="${cls}" data-n="${n.n || ''}" style="${delay}">${shape}` +
      `<text class="t" x="${cx}" y="${ty + (n.k === 'db' ? 3 : 0)}" text-anchor="middle">${esc(n.t)}</text>` +
      (n.s ? `<text class="s" x="${cx}" y="${ty + 15 + (n.k === 'db' ? 2 : 0)}" text-anchor="middle">${esc(n.s)}</text>` : '') + '</g>';
    if (n.n) g += balloon(n.x + n.w, n.y, n.n, j);
  }
  return `<svg class="dg" viewBox="-6 -6 ${dg.w + 12} ${dg.h + 12}" role="img" aria-label="${esc(label)} architecture diagram">${g}</svg>`;
}

/* ───────── Photo record ───────── */
// host shown in the browser-frame title bar: the live demo's domain, else "local build"
function hostOf(p) {
  const live = p.links.find(([t, u]) => /live/i.test(t));
  try { return live ? new URL(live[1]).host : 'local build'; } catch (e) { return 'local build'; }
}

function frameImg(p, src, cap, label) {
  return `<button type="button" class="shot__open" data-src="assets/shots/${src}.jpg" data-cap="${label} — ${cap}" aria-label="Enlarge: ${cap}">
      <span class="chrome" aria-hidden="true"><i></i><i></i><i></i><b>${hostOf(p)}</b><em>⤢</em></span>
      <img src="assets/shots/${src}.jpg" alt="${p.title}: ${cap}" loading="lazy">
    </button>`;
}

function shotsHtml(p, num) {
  if (!p.shots) return '';
  const figs = p.shots.map(([src, cap, note], k) => {
    const label = `Fig ${+num}.${k + 1}`;
    return `<figure class="shot">${frameImg(p, src, cap, label)}
      <figcaption><span>${label}</span> ${cap}${note ? ` <em class="scribble scribble--shot">← ${note}</em>` : ''}</figcaption>
    </figure>`;
  }).join('');
  return `<div class="shots-wrap"><p class="eyebrow">Photo record — as built · click any image to enlarge</p><div class="shots shots--${p.shots.length}">${figs}</div></div>`;
}

/* one fixed-size view per supporting card: screenshot ⇄ architecture */
function viewHtml(p, num) {
  const arch = `<div class="view__pane view__pane--arch" data-pane="arch">${renderDiagram(p.dg, p.title)}</div>`;
  if (!p.shots) {
    return `<div class="view"><span class="view__tag">Architecture</span>${arch}</div>`;
  }
  const [src, cap] = p.shots[0];
  return `<div class="view" data-view>
    <div class="view__tabs" role="tablist" aria-label="${p.title} view">
      <button type="button" role="tab" aria-selected="true" data-show="shot">Screenshot</button>
      <button type="button" role="tab" aria-selected="false" data-show="arch">Architecture</button>
    </div>
    <div class="view__pane view__pane--shot" data-pane="shot">${frameImg(p, src, cap, `Fig ${+num}.1`)}</div>
    ${arch.replace('class="view__pane view__pane--arch"', 'class="view__pane view__pane--arch" hidden')}
  </div>`;
}

/* ───────── Sheet renderer ───────── */
function sheetHtml(p, no, compact) {
  const links = p.links.map(([t, u], k) =>
    `<a class="btn${k === 0 ? ' btn--ink' : ''}" href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('');
  const facts = p.facts ? `<div class="facts">${p.facts.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>` : '';
  const notes = `<ol class="callouts">${p.notes.map((t, k) => `<li data-n="${k + 1}"><i>${k + 1}</i><span>${t}</span></li>`).join('')}</ol>`;
  const stack = `<ul class="stack" aria-label="Tech stack">${p.stack.map(s => `<li>${s}</li>`).join('')}</ul>`;
  const note = p.note ? `<p class="demo-note">${p.note}</p>` : '';
  const num = String(no).padStart(2, '0');
  const scr = p.scribble ? `<span class="scribble scribble--sheet">${p.scribble} ↘</span>` : '';
  if (compact) {
    return `<article class="sheet sheet--compact sheet-frame" id="sheet-${num}" data-title="${p.title}">
      <header class="sheet__head"><span class="sheet__no">${num}</span><div><h3 class="sheet__title">${p.title}</h3><p class="sheet__pitch">${p.pitch}</p></div></header>
      ${viewHtml(p, num)}
      <div class="sheet__spec">${notes}${stack}<div class="sheet__links">${links}</div></div>
    </article>`;
  }
  return `<article class="sheet sheet-frame" id="sheet-${num}" data-title="${p.title}">
    <header class="sheet__head"><span class="sheet__no">${num}</span><div>${scr}<h3 class="sheet__title">${p.title}</h3><p class="sheet__pitch">${p.pitch}</p></div><div class="sheet__links">${links}</div></header>
    <div class="sheet__body">
      <div class="sheet__drawing">${renderDiagram(p.dg, p.title)}</div>
      <div class="sheet__spec">${facts}${notes}${stack}${note}</div>
    </div>
    ${shotsHtml(p, num)}
  </article>`;
}

/* ───────── Boot ───────── */
document.documentElement.classList.add('js');

// shared hatch pattern for "AI" boxes
document.body.insertAdjacentHTML('afterbegin',
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" style="fill:var(--paper)"/><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--hatch);stroke-width:2"/>
    </pattern></defs></svg>`);

document.getElementById('primary').innerHTML = PRIMARY.map((p, k) => sheetHtml(p, k + 1, false)).join('');
document.getElementById('secondary').innerHTML = SECONDARY.map((p, k) => sheetHtml(p, k + 5, true)).join('');

// draw diagrams when they scroll into view
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } });
}, { threshold: 0.25 }) : null;
document.querySelectorAll('.sheet').forEach(s => io ? io.observe(s) : s.classList.add('drawn'));

// callout ↔ diagram highlighting
document.querySelectorAll('.sheet').forEach(sheet => {
  const set = (n, on) => {
    sheet.querySelectorAll(`[data-n="${n}"]`).forEach(el => el.classList.toggle('is-hot', on));
  };
  sheet.addEventListener('mouseover', e => { const t = e.target.closest('[data-n]'); if (t && t.dataset.n) set(t.dataset.n, true); });
  sheet.addEventListener('mouseout', e => { const t = e.target.closest('[data-n]'); if (t && t.dataset.n) set(t.dataset.n, false); });
});

// paper / blueprint toggle
document.getElementById('theme').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// lightbox for screenshots
const lb = document.createElement('dialog');
lb.className = 'lightbox';
lb.innerHTML = '<button type="button" class="lightbox__close" aria-label="Close">Close ✕</button><img alt=""><p></p>';
document.body.appendChild(lb);
document.addEventListener('click', e => {
  const b = e.target.closest('.shot__open');
  if (b) {
    lb.querySelector('img').src = b.dataset.src;
    lb.querySelector('img').alt = b.dataset.cap;
    lb.querySelector('p').textContent = b.dataset.cap;
    if (lb.showModal) lb.showModal(); else window.open(b.dataset.src, '_blank');
    return;
  }
  if (e.target === lb || e.target.closest('.lightbox__close')) lb.close();
});

// screenshot ⇄ architecture switch on supporting cards
document.addEventListener('click', e => {
  const t = e.target.closest('[data-show]');
  if (!t) return;
  const view = t.closest('[data-view]');
  view.querySelectorAll('[data-show]').forEach(b => b.setAttribute('aria-selected', String(b === t)));
  view.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.show; });
});

// sheet index rail (wide screens): highlights the sheet in view
(() => {
  const sheets = [...document.querySelectorAll('.sheet')];
  const rail = document.createElement('nav');
  rail.className = 'rail';
  rail.setAttribute('aria-label', 'Project index');
  rail.innerHTML = '<span class="rail__h">Sheets</span>' + sheets.map(s =>
    `<a href="#${s.id}" data-for="${s.id}"><span>${s.id.slice(-2)}</span><em>${s.dataset.title}</em></a>`).join('');
  document.body.appendChild(rail);
  const work = document.getElementById('work');
  const links = rail.querySelectorAll('a');
  const onScroll = () => {
    const y = window.innerHeight * 0.35;
    let cur = null;
    sheets.forEach(s => { if (s.getBoundingClientRect().top < y) cur = s.id; });
    const last = sheets[sheets.length - 1].getBoundingClientRect().bottom;
    const show = work.getBoundingClientRect().top < window.innerHeight * 0.6 && last > 0;
    rail.classList.toggle('is-on', show);
    links.forEach(a => a.classList.toggle('is-cur', a.dataset.for === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
