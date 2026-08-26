import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
W, H = 2600, 850
img = Image.new("RGBA", (W, H), color=(7, 9, 14, 255)) # #07090E
draw = ImageDraw.Draw(img)

# Try loading Windows system fonts
def get_font(size, bold=False):
    font_names = ["segoeuib.ttf" if bold else "segoeui.ttf", "arialbd.ttf" if bold else "arial.ttf", "consola.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except Exception:
            continue
    return ImageFont.load_default()

title_font = get_font(34, bold=True)
sub_font = get_font(20, bold=False)
box_title_font = get_font(24, bold=True)
box_sub_font = get_font(18, bold=False)
box_micro_font = get_font(15, bold=False)
badge_font = get_font(16, bold=True)

# Title Header
draw.text((W // 2, 40), "DUAL-SPEED EVALUATION & AI GOVERNANCE ENGINE", fill=(237, 243, 252, 255), font=title_font, anchor="mm")
draw.text((W // 2, 75), "ControlPlane.ai • Real-Time Model-Agnostic Oversight Architecture", fill=(148, 163, 184, 255), font=sub_font, anchor="mm")

# Subgraph Boundary Box
subgraph_rect = (450, 120, 1850, 780)
draw.rounded_rectangle(subgraph_rect, radius=18, fill=(16, 22, 33, 255), outline=(30, 41, 59, 255), width=3)
draw.text((475, 145), "SUBGRAPH: DUAL-SPEED EVALUATION ENGINE (FAST + PARALLEL JUDGE)", fill=(100, 116, 139, 255), font=badge_font)

# Helper function to draw rounded box with text
def draw_card(rect, fill_col, outline_col, title, sub="", micro="", title_col=(255,255,255), sub_col=(0,240,255)):
    draw.rounded_rectangle(rect, radius=14, fill=fill_col, outline=outline_col, width=3)
    cx = (rect[0] + rect[2]) // 2
    cy = (rect[1] + rect[3]) // 2
    if micro:
        draw.text((cx, cy - 24), title, fill=title_col, font=box_title_font, anchor="mm")
        draw.text((cx, cy + 2), sub, fill=sub_col, font=box_sub_font, anchor="mm")
        draw.text((cx, cy + 26), micro, fill=(148, 163, 184), font=box_micro_font, anchor="mm")
    elif sub:
        draw.text((cx, cy - 14), title, fill=title_col, font=box_title_font, anchor="mm")
        draw.text((cx, cy + 16), sub, fill=sub_col, font=box_sub_font, anchor="mm")
    else:
        draw.text((cx, cy), title, fill=title_col, font=box_title_font, anchor="mm")

# Helper to draw arrows with heads
def draw_arrow(p1, p2, col=(0, 240, 255), label=""):
    draw.line([p1, p2], fill=col, width=4)
    # Simple arrowhead
    x2, y2 = p2
    if p2[0] > p1[0]: # Right
        draw.polygon([(x2, y2), (x2 - 12, y2 - 7), (x2 - 12, y2 + 7)], fill=col)
        if label:
            draw.text(((p1[0] + p2[0]) // 2, p1[1] - 16), label, fill=col, font=badge_font, anchor="mm")
    elif p2[1] > p1[1]: # Down
        draw.polygon([(x2, y2), (x2 - 7, y2 - 12), (x2 + 7, y2 - 12)], fill=col)
        if label:
            draw.text((p1[0] + 18, (p1[1] + p2[1]) // 2), label, fill=col, font=badge_font, anchor="lm")
    elif p2[1] < p1[1]: # Up
        draw.polygon([(x2, y2), (x2 - 7, y2 + 12), (x2 + 7, y2 + 12)], fill=col)

# 1. User / Application Box
card_user = (40, 360, 250, 480)
draw_card(card_user, (17, 24, 39), (0, 240, 255), "User / App", "Prompt Input", sub_col=(0, 240, 255))

# Arrow 1 -> Gateway
draw_arrow((250, 420), (320, 420), col=(0, 240, 255), label="Prompt")

# 2. ControlPlane.ai Gateway
card_gw = (320, 360, 520, 480)
draw_card(card_gw, (22, 30, 46), (56, 189, 248), "ControlPlane.ai", "Reverse Proxy", sub_col=(56, 189, 248))

# Arrow Gateway -> Fast Guard
draw_arrow((520, 420), (580, 420), col=(56, 189, 248))

# 3. 1. Fast Inline Guard (<15ms)
card_fast = (580, 340, 840, 500)
draw_card(card_fast, (26, 35, 51), (245, 158, 11), "1. FAST INLINE", "Guard (<15ms)", "Luhn • Regex • Jailbreak", title_col=(245, 158, 11), sub_col=(255, 255, 255))

# Arrow Fast Guard -> Diamond
draw_arrow((840, 420), (920, 420), col=(245, 158, 11))

# 4. Diamond: Critical Threat?
# Draw Diamond
d_center = (990, 420)
d_size = 70
diamond_pts = [(d_center[0], d_center[1] - d_size), (d_center[0] + d_size, d_center[1]), (d_center[0], d_center[1] + d_size), (d_center[0] - d_size, d_center[1])]
draw.polygon(diamond_pts, fill=(30, 41, 59), outline=(245, 158, 11))
draw.text((d_center[0], d_center[1] - 10), "Critical", fill=(254, 230, 138), font=box_sub_font, anchor="mm")
draw.text((d_center[0], d_center[1] + 12), "Threat?", fill=(254, 230, 138), font=box_sub_font, anchor="mm")

# Branch YES (Upwards) -> Tier 3 Block
draw.line([(d_center[0], d_center[1] - d_size), (d_center[0], 230), (1140, 230)], fill=(239, 68, 68), width=4)
draw.polygon([(1140, 230), (1128, 223), (1128, 237)], fill=(239, 68, 68))
draw.text((d_center[0] + 15, 270), "YES (Threat Detected)", fill=(239, 68, 68), font=badge_font, anchor="lm")

card_tier3 = (1140, 180, 1420, 280)
draw_card(card_tier3, (42, 18, 21), (239, 68, 68), "🛑 Tier 3: Block & Log", "Instant Intercept", title_col=(252, 165, 165), sub_col=(248, 113, 113))

# Branch NO (Rightwards) -> LLM Generation
draw_arrow((d_center[0] + d_size, d_center[1]), (1140, 420), col=(16, 185, 129), label="NO (Safe)")

# 5. LLM Generation Box
card_llm = (1140, 360, 1390, 480)
draw_card(card_llm, (19, 35, 30), (16, 185, 129), "LLM Generation", "Groq / Meta Llama 3", sub_col=(52, 211, 153))

# Arrow LLM -> Judge Model
draw_arrow((1390, 420), (1460, 420), col=(16, 185, 129))

# 6. 2. Parallel Judge Model (~180ms)
card_judge = (1460, 340, 1760, 500)
draw_card(card_judge, (26, 28, 46), (168, 85, 247), "2. PARALLEL JUDGE", "Model (~180ms)", "Factual Grounding vs RAG", title_col=(192, 132, 252), sub_col=(255, 255, 255))

# Out of Judge -> 2 branches:
# Branch A: Ungrounded < 75% -> Tier 2 Warning (Up-Right)
draw.line([(1760, 390), (1880, 390), (1880, 320), (1960, 320)], fill=(245, 158, 11), width=4)
draw.polygon([(1960, 320), (1948, 313), (1948, 327)], fill=(245, 158, 11))
draw.text((1880, 295), "Ungrounded (<75%)", fill=(245, 158, 11), font=badge_font, anchor="mm")

card_tier2 = (1960, 275, 2350, 365)
draw_card(card_tier2, (45, 33, 16), (245, 158, 11), "🟡 Tier 2: Citation Warning", "Soft Warning Badge Attached", title_col=(253, 230, 138), sub_col=(217, 119, 6))

# Branch B: Grounded >= 75% -> Tier 1 Safe (Down-Right)
draw.line([(1760, 450), (1880, 450), (1880, 520), (1960, 520)], fill=(16, 185, 129), width=4)
draw.polygon([(1960, 520), (1948, 513), (1948, 527)], fill=(16, 185, 129))
draw.text((1880, 545), "Grounded (>=75%)", fill=(16, 185, 129), font=badge_font, anchor="mm")

card_tier1 = (1960, 475, 2350, 565)
draw_card(card_tier1, (15, 38, 29), (16, 185, 129), "🟢 Tier 1: Safe Delivery", "Clean Verified Output", title_col=(110, 231, 183), sub_col=(5, 150, 105))

# Final Destinations:
# Destination 1: HITL Queue
card_hitl = (1960, 150, 2550, 240)
draw_card(card_hitl, (31, 26, 46), (236, 72, 153), "⚠️ HITL Compliance Queue", "Human Triage, 1-Click Remediation & SOC-2 Audit", title_col=(244, 114, 182), sub_col=(219, 39, 119))

# Connector Tier 3 -> HITL
draw.line([(1420, 230), (1960, 195)], fill=(239, 68, 68), width=3)
draw.polygon([(1960, 195), (1945, 190), (1948, 203)], fill=(239, 68, 68))

# Connector Tier 2 -> HITL
draw.line([(2155, 275), (2155, 240)], fill=(245, 158, 11), width=3)
draw.polygon([(2155, 240), (2148, 252), (2162, 252)], fill=(245, 158, 11))

# Destination 2: Live Telemetry Stream
card_stream = (1960, 600, 2550, 690)
draw_card(card_stream, (14, 23, 38), (0, 240, 255), "📡 Real-Time Telemetry Stream", "Live WebSocket Feed • Adaptive Sampling Engine", title_col=(103, 232, 249), sub_col=(2, 132, 199))

# Connector Tier 1 -> Live Stream
draw.line([(2155, 565), (2155, 600)], fill=(16, 185, 129), width=3)
draw.polygon([(2155, 600), (2148, 588), (2162, 588)], fill=(16, 185, 129))

# Save output
output_path_public = Path("frontend/public/architecture_flowchart_hd.png")
output_path_public.parent.mkdir(parents=True, exist_ok=True)
img.save(output_path_public, format="PNG", optimize=True)

# Also save to artifacts directory
artifact_dir = Path(r"C:\Users\tanut\.gemini\antigravity\brain\532d1dd3-5119-4d19-950e-91166c48c5e2")
artifact_output = artifact_dir / "architecture_flowchart_hd.png"
img.save(artifact_output, format="PNG", optimize=True)

print(f"SUCCESS: Generated Ultra-HD Flowchart at {output_path_public.resolve()} ({output_path_public.stat().st_size / 1024:.1f} KB)")
print(f"SUCCESS: Copied to Artifacts at {artifact_output.resolve()}")
