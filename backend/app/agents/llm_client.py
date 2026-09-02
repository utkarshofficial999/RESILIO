import requests
import json
from app.config import settings

def call_groq_llm(prompt: str, system_message: str = "You are RESILIO, an autonomous payment recovery AI agent for Razorpay.") -> str:
    """
    Executes an ultra-fast LLM inference call via Groq Cloud API.
    Model: llama-3.3-70b-versatile or llama-3.1-8b-instant
    Falls back gracefully to None if API key is not configured or network error occurs.
    """
    api_key = settings.GROQ_API_KEY
    if not api_key or len(api_key.strip()) < 10:
        return None

    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 300
        }
        response = requests.post(url, headers=headers, json=payload, timeout=2.5)
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[RESILIO LLM] Groq API fallback: {e}")
    
    return None
