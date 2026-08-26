import os
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
HERO_IMG_PATH = (BASE_DIR / "frontend" / "public" / "hero_banner.png").resolve().as_uri()
FLOWCHART_IMG_PATH = (BASE_DIR / "frontend" / "public" / "architecture_flowchart_hd.png").resolve().as_uri()



# --- 1. GENERATE SLEEK README HTML ---
readme_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ControlPlane.ai — Technical Architecture & Solution Design</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@600;700;800;900&display=swap');
  
  @page {{
    size: A4;
    margin: 14mm 14mm 14mm 14mm;
    @bottom-right {{
      content: counter(page);
      font-size: 8pt;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }}
  }}

  body {{
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }}

  h1, h2, h3, h4 {{
    font-family: 'Outfit', sans-serif;
    color: #0f172a;
    page-break-after: avoid;
  }}

  h1 {{ font-size: 20pt; margin: 4px 0 2px 0; color: #090d16; }}
  h2 {{ font-size: 13pt; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; margin-top: 16pt; margin-bottom: 8pt; color: #1e293b; }}
  h3 {{ font-size: 11pt; margin-top: 12pt; margin-bottom: 4pt; color: #334155; }}

  .hero-container {{
    text-align: center;
    margin-bottom: 12px;
  }}

  .hero-banner {{
    max-width: 82%;
    max-height: 155px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }}

  .badge {{
    display: inline-block;
    padding: 2px 8px;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
    border-radius: 999px;
    font-size: 8pt;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    margin-bottom: 6px;
  }}

  .card-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 10px 0;
  }}

  .stat-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }}

  .stat-val {{
    font-size: 15pt;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    color: #b45309;
  }}

  .stat-label {{
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }}

  .flowchart-box {{
    background: #090d16;
    border-radius: 8px;
    padding: 8px;
    margin: 10px 0;
    text-align: center;
    border: 1px solid #1e293b;
  }}

  .flowchart-img {{
    width: 100%;
    max-height: 180px;
    object-fit: contain;
    border-radius: 6px;
  }}

  .formula-box {{
    background: #f8fafc;
    border-left: 4px solid #f59e0b;
    border: 1px solid #e2e8f0;
    border-left-width: 4px;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 10px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
  }}

  .formula-title {{
    font-weight: 700;
    color: #0f172a;
    font-size: 8.5pt;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
  }}

  .formula-math {{
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0f172a;
  }}

  .formula-cases {{
    display: inline-block;
    border-left: 2px solid #0f172a;
    padding-left: 8px;
    font-size: 8.5pt;
    line-height: 1.6;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 9pt;
  }}

  th, td {{
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    text-align: left;
  }}

  th {{
    background: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    text-transform: uppercase;
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    padding: 1px 3px;
    border-radius: 3px;
  }}

  .page-break {{
    page-break-before: always;
  }}
</style>
</head>
<body>

  <!-- CENTERED CANVA HERO BANNER -->
  <div class="hero-container">
    <img src="{HERO_IMG_PATH}" class="hero-banner" alt="ControlPlane.ai Banner">
  </div>

  <div style="text-align: center;">
    <div class="badge">ACCENTURE INNOVATION CHALLENGE 2026 • OFFICIAL TECHNICAL README</div>
    <h1>ControlPlane.ai 🛡️</h1>
    <p style="font-size: 10.5pt; color: #475569; margin: 2px 0 10px 0;">
      <strong>Model-Agnostic Real-Time AI Oversight, Guardrail &amp; Quality Control Tower</strong><br>
      <em>Lead Innovator &amp; Software Architect: Tanu Shree</em>
    </p>
  </div>

  <h2>1. Executive Summary &amp; The Enterprise AI Blind Spot</h2>
  <p>
    Deploying a Generative AI model was never the hard part. <strong>Trusting what it says, every single time, is.</strong> Traditional APM tools (Datadog, New Relic) only monitor deterministic metrics like CPU load and HTTP 200 codes. When an LLM outputs a fabricated $10M financial claim or leaks customer credit cards, conventional alarms report <code>HTTP 200 OK</code>. ControlPlane.ai bridges this blind spot by inspecting content safety, factual grounding, and compute efficiency in real time.
  </p>

  <div class="card-grid">
    <div class="stat-card">
      <div class="stat-val">$67.4B</div>
      <div class="stat-label">Hallucination Loss</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">97%</div>
      <div class="stat-label">Security Access Gap</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">63%</div>
      <div class="stat-label">No Quality Gates</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">&lt;15 ms</div>
      <div class="stat-label">Fast Guard SLA</div>
    </div>
  </div>

  <h2>2. System Architecture: Dual-Speed Evaluation Engine</h2>
  <p>
    ControlPlane.ai decouples fast synchronous security checks from deep asynchronous factual reasoning:
  </p>

  <!-- INSERTED FLOWCHART GRAPHIC -->
  <div class="flowchart-box">
    <img src="{FLOWCHART_IMG_PATH}" class="flowchart-img" alt="Dual-Speed Evaluation Engine Architecture">
  </div>

  <div class="page-break"></div>

  <h2>3. Mathematical Dynamic Adaptive Sampling</h2>
  <p>
    Deep LLM evaluation on 100% of routine traffic is economically unsustainable. ControlPlane.ai dynamically modulates inspection depth based on active anomaly frequency:
  </p>

  <!-- CLEAN RENDERED FORMULA BOX (NO LATEX ARTIFACTS) -->
  <div class="formula-box">
    <span class="formula-title">Dynamic Threat-Triggered Controller:</span>
    <div class="formula-math">
      <strong>SampleRate(t) = </strong>
      <div class="formula-cases">
        <strong>25%</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <em>if</em> AnomalyRate<sub>60s</sub> &le; 15% &nbsp; (<strong>Nominal Mode</strong>)<br>
        <strong>min(100%, 25% + &alpha; &middot; AnomalyRate)</strong> &nbsp;&nbsp;&nbsp; <em>if</em> AnomalyRate<sub>60s</sub> &gt; 15% &nbsp; (<strong>Surge Mode</strong>)
      </div>
    </div>
  </div>

  <ul>
    <li><strong>Routine Conditions:</strong> Evaluates 25% of baseline traffic, slashing evaluation compute costs by <strong>75%</strong>.</li>
    <li><strong>Threat Surge / Attack Injections:</strong> Instantly scales up to <strong>85%–100%</strong> inspection depth to shield enterprise infrastructure during attack flurries.</li>
  </ul>

  <h2>4. Why We Used These Technologies (Design Rationale)</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Technology</th>
        <th style="width: 20%;">Architecture Layer</th>
        <th>Strategic &amp; Engineering Rationale</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Groq Cloud (LPU)</strong></td>
        <td>Inference Engine</td>
        <td>Provides &lt;200ms time-to-first-token inference for 70B/8B models, allowing live parallel Judge verification with zero user lag.</td>
      </tr>
      <tr>
        <td><strong>Meta Llama 3 / Compound</strong></td>
        <td>Base &amp; Judge Models</td>
        <td>Open-weights, enterprise-safe with superior reasoning on structured JSON output and factual comparison benchmarks.</td>
      </tr>
      <tr>
        <td><strong>FastAPI (Python 3.10+)</strong></td>
        <td>Backend Gateway</td>
        <td>Asynchronous ASGI architecture with built-in Pydantic validation, concurrent background workers, and native WebSockets.</td>
      </tr>
      <tr>
        <td><strong>React 19 + TypeScript + Vite</strong></td>
        <td>Frontend Platform</td>
        <td>Strict type safety across the telemetry contract, rapid HMR developer velocity, and optimized component re-rendering.</td>
      </tr>
      <tr>
        <td><strong>Tailwind CSS (Dark Obsidian)</strong></td>
        <td>Executive UI</td>
        <td>High-contrast, accessibility-compliant executive dark aesthetic (<code>#07090E</code>) with light typography and glowing indicators.</td>
      </tr>
      <tr>
        <td><strong>Recharts</strong></td>
        <td>Visual Analytics</td>
        <td>Declarative, GPU-accelerated SVG charting for OWASP threat distribution and latency histograms.</td>
      </tr>
    </tbody>
  </table>

  <h2>5. OWASP Top 10 for LLMs Security Mapping</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">OWASP ID</th>
        <th style="width: 30%;">Vulnerability Name</th>
        <th>ControlPlane.ai Defensive Mechanism</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>LLM01</code></td>
        <td><strong>Prompt Injection</strong></td>
        <td>Synchronous heuristic and delimiter analysis stops jailbreak attempts in &lt;15ms.</td>
      </tr>
      <tr>
        <td><code>LLM02</code></td>
        <td><strong>Sensitive Info Disclosure</strong></td>
        <td>Regex, Luhn algorithm, and secret scanners strip/block API keys, credit cards, and SSNs.</td>
      </tr>
      <tr>
        <td><code>LLM03</code></td>
        <td><strong>Hallucination / Misinformation</strong></td>
        <td>Parallel Judge model scores factual groundedness against verified reference documents.</td>
      </tr>
      <tr>
        <td><code>LLM04</code></td>
        <td><strong>Data &amp; Model Poisoning</strong></td>
        <td>HITL audit trail isolates anomalous model outputs and triggers administrative review.</td>
      </tr>
      <tr>
        <td><code>LLM06</code></td>
        <td><strong>Excessive Agency</strong></td>
        <td>Dynamic Tiered gating prevents unauthorized downstream execution of unverified commands.</td>
      </tr>
      <tr>
        <td><code>LLM10</code></td>
        <td><strong>Unbounded Consumption</strong></td>
        <td>Token metering and adaptive sampling depth caps prevent denial-of-wallet compute spikes.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>6. Key Modules &amp; Capabilities</h2>
  <ul>
    <li><strong>📡 Control Tower:</strong> Real-time throughput metrics, blocked critical intercepts counter, and live OWASP threat distribution.</li>
    <li><strong>🧪 Gateway Lab:</strong> Interactive sandbox with 1-click live presets (Credit Card exfiltration, financial hallucination, prompt injection, and grounded RAG).</li>
    <li><strong>⚠️ HITL Queue:</strong> 5-point forensic review modal with 1-click remediation (Approve, Reject, or Redirect to Canned Response) and SOC-2 audit exporter.</li>
    <li><strong>⚙️ Policy Studio:</strong> Centralized rule configuration with hallucination sensitivity sliders and encrypted API key management.</li>
  </ul>

  <h2>7. Quick Start &amp; Execution Guide</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Step</th>
        <th style="width: 35%;">Action</th>
        <th>Commands</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Clone Repo</strong></td>
        <td>Download project source</td>
        <td><code>git clone https://github.com/tanu99C/ControlPlane-.ai.git</code></td>
      </tr>
      <tr>
        <td><strong>2. Setup .env</strong></td>
        <td>Copy template &amp; add Groq key</td>
        <td><code>copy backend\\.env.example backend\\.env</code></td>
      </tr>
      <tr>
        <td><strong>3. Start Backend</strong></td>
        <td>FastAPI server (Port 8000)</td>
        <td><code>cd backend &amp;&amp; python -m uvicorn app.main:app --reload</code></td>
      </tr>
      <tr>
        <td><strong>4. Start Frontend</strong></td>
        <td>React dev server (Port 5173)</td>
        <td><code>cd frontend &amp;&amp; npm install &amp;&amp; npm run dev</code></td>
      </tr>
    </tbody>
  </table>

  <h2>8. Scalability Roadmap</h2>
  <ul>
    <li><strong>Q4 2026:</strong> Multi-hop agentic guardrails (autonomous agent tool-call interception).</li>
    <li><strong>Q1 2027:</strong> Air-gapped on-premise deployment package with vLLM / Ollama sidecars.</li>
    <li><strong>Q2 2027:</strong> Automated continuous model fine-tuning feedback loop based on HITL rejection logs.</li>
  </ul>

  <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 9pt; color: #64748b; text-align: center;">
    <strong>ControlPlane.ai</strong> • Developed for Accenture Innovation Challenge 2026 • Lead Author: <strong>Tanu Shree</strong>
  </div>

</body>
</html>
"""

# Write HTML files
readme_html_path = BASE_DIR / "README_EXPORT.html"
readme_html_path.write_text(readme_html, encoding="utf-8")

readme_pdf_path = BASE_DIR / "ControlPlane_AI_README.pdf"
proposal_pdf_path = BASE_DIR / "ControlPlane_AI_Business_Proposal.pdf"

# Find browser executable
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

print(f"Using browser: {chrome_path}")

cmd1 = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={readme_pdf_path}",
    readme_html_path.as_uri()
]

subprocess.run(cmd1, check=True)

print(f"SUCCESS: Generated {readme_pdf_path.name} ({readme_pdf_path.stat().st_size / 1024:.1f} KB)")
