import os
from pydantic_settings import BaseSettings, SettingsConfigDict

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
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

