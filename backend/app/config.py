import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RESILIO — Autonomous Payment Recovery Intelligence"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini") # "gemini", "openai", "fallback"
    
    # Simulation Settings
    SIMULATION_MODE: bool = True
    DEFAULT_CURRENCY: str = "INR"
    
    class Config:
        env_file = ".env"

settings = Settings()
