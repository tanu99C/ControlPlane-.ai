import os
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

readme_html = BASE_DIR / "README_EXPORT.html"
readme_pdf = BASE_DIR / "ControlPlane_AI_README.pdf"

proposal_html = BASE_DIR / "BUSINESS_PROPOSAL_EXPORT.html"
proposal_pdf = BASE_DIR / "ControlPlane_AI_Business_Proposal.pdf"

print("Using browser:", chrome_path)

def html_to_pdf(html_path: Path, pdf_path: Path):
    file_url = html_path.as_uri()
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        file_url
    ]
    print("Executing:", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True)
    if pdf_path.exists():
        print(f"SUCCESS: {pdf_path.name} ({pdf_path.stat().st_size / 1024:.1f} KB)")
    else:
        print(f"FAILED: {pdf_path.name}")
        print("Stderr:", res.stderr)

html_to_pdf(readme_html, readme_pdf)
html_to_pdf(proposal_html, proposal_pdf)
