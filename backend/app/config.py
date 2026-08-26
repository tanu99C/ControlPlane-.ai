import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv


# Search for .env in current and parent directory
env_path_backend = Path(__file__).resolve().parent.parent / ".env"
env_path_root = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path_backend.exists():
    load_dotenv(dotenv_path=env_path_backend, override=True)
elif env_path_root.exists():
    load_dotenv(dotenv_path=env_path_root, override=True)
else:
    load_dotenv(override=True)


class Settings(BaseModel):
    PROJECT_NAME: str = "ControlPlane Checker"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DEFAULT_GROQ_MODEL: str = os.getenv("DEFAULT_GROQ_MODEL", "groq/compound")
    JUDGE_MODEL: str = os.getenv("JUDGE_MODEL", "groq/compound-mini")
    
    # Fast Inline Check Defaults
    MAX_TOKEN_BUDGET: int = 4096
    PII_BLOCK_ENABLED: bool = True
    INJECTION_BLOCK_ENABLED: bool = True
    
    # Judge Evaluation Defaults
    GROUNDEDNESS_THRESHOLD: float = 0.75
    TOXICITY_THRESHOLD: float = 0.70
    
    # Adaptive Sampling Defaults
    BASE_SAMPLING_RATE: float = 0.25
    ANOMALY_TRIGGER_THRESHOLD: float = 0.15
    SPIKE_SAMPLING_RATE: float = 0.85

settings = Settings()
