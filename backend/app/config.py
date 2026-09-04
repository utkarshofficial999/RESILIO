import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Ensure .env is loaded from root workspace or local directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv() # Fallback local .env

class Settings(BaseSettings):
    PROJECT_NAME: str = "RESILIO — Autonomous Payment Recovery Intelligence"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server Settings
    PORT: int = int(os.getenv("PORT", 8000))
    
    # LLM Settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq") # "groq", "gemini", "openai", "fallback"

    
    # Simulation Settings
    SIMULATION_MODE: bool = True
    DEFAULT_CURRENCY: str = "INR"
    
    # Razorpay Gateway Integration (Test / Live)
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

