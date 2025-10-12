import os
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")


def get_api_key(api_key_header: str = Security(api_key_header)):
    """Verifies that the X-API-Key header matches the one in the environment"""
    correct_api_key = os.getenv("PLAYGROUND_API_KEY")
    if not correct_api_key or api_key_header != correct_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
    return api_key_header
