from typing import List, Optional
from pydantic import BaseModel, Field


class TestPromptRequest(BaseModel):
    promp: str = Field(..., min_length=1, max_length=1000)


class TestPromptResponse(BaseModel):
    response: str


class SettingsResponse(BaseModel):
    """Response model for current settings."""

    provider: str
    model: str
    temperature: float
    available_models: List[str]


class UpdateSettingsRequest(BaseModel):
    """Request model for updating settings."""

    provider: Optional[str] = Field(
        None, description="The new provider to use (e.g., 'openai')"
    )
    model: Optional[str] = Field(
        None, description="The new model to use (e.g., 'gpt-4o-mini')"
    )
    temperature: Optional[float] = Field(
        None, ge=0.0, le=2.0, description="The temperature to use (0.0 to 2.0)"
    )
