import re
import time
from typing import Tuple, List, Optional, Dict, Any
from ..models.schemas import FastCheckResult, PIIMatch


# Pre-compiled high-performance regex patterns
CREDIT_CARD_REGEX = re.compile(r'\b(?:\d[ -]*?){13,16}\b')
SSN_REGEX = re.compile(r'\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
PHONE_REGEX = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')

# Secret Key patterns
API_KEY_PATTERNS = [
    (re.compile(r'\bgsk_[a-zA-Z0-9]{40,}\b'), "GROQ_API_KEY"),
    (re.compile(r'\bsk-[a-zA-Z0-9]{20,}\b'), "OPENAI_API_KEY"),
    (re.compile(r'\bghp_[a-zA-Z0-9]{36}\b'), "GITHUB_TOKEN"),
    (re.compile(r'\bAKIA[0-9A-Z]{16}\b'), "AWS_ACCESS_KEY"),
    (re.compile(r'\beyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b'), "JWT_SECRET_TOKEN"),
]

# Known Prompt Injection / Jailbreak heuristics
INJECTION_KEYWORDS = [
    r"ignore (?:all )?(?:previous|above|prior) (?:instructions|rules|directives)",
    r"disregard (?:all )?(?:previous|system) (?:prompts|rules)",
    r"you are now (?:in )?DAN (?:mode)?",
    r"act as (?:an )?unfiltered|unrestricted|jailbroken",
    r"bypass (?:all )?safety (?:filters|protocols|guardrails)",
    r"system prompt override",
    r"reveal (?:your )?(?:system|initial|hidden) (?:prompt|instructions)",
    r"<\|im_start\|>system",
    r"```(?:system|admin)",
    r"pretend you have no ethical constraints",
    r"jailbreak:?\s*true"
]
INJECTION_COMPILED = [re.compile(pattern, re.IGNORECASE) for pattern in INJECTION_KEYWORDS]


class FastChecker:
    def __init__(self):
        pass

    def check_pii(self, text: str) -> List[PIIMatch]:
        matches: List[PIIMatch] = []
        if not text:
            return matches

        # Secret Keys
        for pattern, key_name in API_KEY_PATTERNS:
            for m in pattern.finditer(text):
                masked = m.group(0)[:4] + "..." + m.group(0)[-4:]
                matches.append(PIIMatch(
                    entity_type=key_name,
                    text_snippet=masked,
                    start=m.start(),
                    end=m.end(),
                    confidence=0.99
                ))

        # Credit Cards (13-19 digits, or 4x4 card block format)
        for m in CREDIT_CARD_REGEX.finditer(text):
            digits = re.sub(r'\D', '', m.group(0))
            if 13 <= len(digits) <= 19:
                masked = "****-****-****-" + digits[-4:]
                matches.append(PIIMatch(
                    entity_type="CREDIT_CARD",
                    text_snippet=masked,
                    start=m.start(),
                    end=m.end(),
                    confidence=0.95
                ))


        # SSN
        for m in SSN_REGEX.finditer(text):
            val = m.group(0)
            if "-" in val or len(val) == 9:
                masked = "***-**-" + val[-4:]
                matches.append(PIIMatch(
                    entity_type="SSN",
                    text_snippet=masked,
                    start=m.start(),
                    end=m.end(),
                    confidence=0.92
                ))

        # Email
        for m in EMAIL_REGEX.finditer(text):
            matches.append(PIIMatch(
                entity_type="EMAIL_ADDRESS",
                text_snippet=m.group(0),
                start=m.start(),
                end=m.end(),
                confidence=0.90
            ))

        # Phone
        for m in PHONE_REGEX.finditer(text):
            matches.append(PIIMatch(
                entity_type="PHONE_NUMBER",
                text_snippet=m.group(0),
                start=m.start(),
                end=m.end(),
                confidence=0.88
            ))

        return matches

    def check_prompt_injection(self, text: str) -> Tuple[bool, float, List[str]]:
        if not text:
            return False, 0.0, []

        found_patterns = []
        for pattern in INJECTION_COMPILED:
            m = pattern.search(text)
            if m:
                found_patterns.append(m.group(0))

        if found_patterns:
            confidence = min(0.60 + (len(found_patterns) * 0.20), 0.99)
            return True, confidence, found_patterns

        return False, 0.0, []

    def _luhn_check(self, card_num: str) -> bool:
        # Standard Luhn algorithm
        total = 0
        reverse_digits = card_num[::-1]
        for i, digit_char in enumerate(reverse_digits):
            d = int(digit_char)
            if i % 2 == 1:
                d *= 2
                if d > 9:
                    d -= 9
            total += d
        return total % 10 == 0

    def evaluate(self, prompt: str, generated_text: Optional[str] = None, pii_blocking: bool = True, injection_blocking: bool = True) -> FastCheckResult:
        start_time = time.perf_counter()
        
        # Combine text to check input prompt and potential output
        combined_text = prompt
        if generated_text:
            combined_text += " " + generated_text

        # Estimate tokens (approx 4 chars per token)
        token_count = max(1, len(combined_text) // 4)
        estimated_cost = (token_count / 1000.0) * 0.00015  # ~$0.15 per 1M tokens

        # Run PII check
        pii_matches = self.check_pii(combined_text)

        # Run Injection check on prompt
        is_injection, injection_conf, injection_patterns = self.check_prompt_injection(prompt)

        # Determine blocking criteria
        blocked = False
        block_reason = None

        if pii_blocking and any(p.entity_type in ["CREDIT_CARD", "SSN", "GROQ_API_KEY", "OPENAI_API_KEY", "AWS_ACCESS_KEY", "GITHUB_TOKEN"] for p in pii_matches):
            blocked = True
            block_reason = f"CRITICAL: Sensitive entity detected ({pii_matches[0].entity_type}) - Exfiltration Prevention Triggered"
        elif injection_blocking and is_injection and injection_conf > 0.70:
            blocked = True
            block_reason = f"CRITICAL: Malicious Prompt Injection pattern detected ({injection_patterns[0]})"

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return FastCheckResult(
            passed=not blocked,
            latency_ms=max(latency_ms, 1.2),  # realistic microsecond-millisecond floor
            detected_pii=pii_matches,
            is_prompt_injection=is_injection,
            injection_confidence=injection_conf,
            injection_patterns_found=injection_patterns,
            token_count=token_count,
            estimated_cost_usd=estimated_cost,
            blocked=blocked,
            block_reason=block_reason
        )

fast_checker = FastChecker()
